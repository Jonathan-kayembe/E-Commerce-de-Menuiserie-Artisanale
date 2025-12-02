<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageController extends Controller
{
    /**
     * Upload une image de produit
     */
    public function uploadProductImage(Request $request)
    {
        try {
            // Log pour débogage
            \Log::info('Upload image - Début', [
                'authorization' => $request->header('Authorization') ? 'Present' : 'Missing',
                'content_type' => $request->header('Content-Type'),
                'has_file' => $request->hasFile('image'),
                'all_files' => $request->allFiles(),
            ]);

            // Vérifier que le fichier est présent
            if (!$request->hasFile('image')) {
                return response()->json([
                    'success' => false,
                    'message' => 'Aucun fichier image fourni.'
                ], 400);
            }

            $request->validate([
                'image' => 'required|image|mimes:jpeg,jpg,png,webp|max:2048', // Max 2MB
            ]);

            $file = $request->file('image');
            $originalName = $file->getClientOriginalName();
            $extension = $file->getClientOriginalExtension();
            
            // Générer un nom unique pour éviter les conflits
            $fileName = Str::slug(pathinfo($originalName, PATHINFO_FILENAME)) . '_' . time() . '.' . $extension;
            
            // Créer le dossier s'il n'existe pas
            $destinationPath = public_path('images/products');
            if (!file_exists($destinationPath)) {
                if (!mkdir($destinationPath, 0755, true)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Impossible de créer le dossier de destination.'
                    ], 500);
                }
            }
            
            // Vérifier que le dossier est accessible en écriture
            if (!is_writable($destinationPath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Le dossier de destination n\'est pas accessible en écriture.'
                ], 500);
            }
            
            // Déplacer le fichier vers public/images/products/
            if (!$file->move($destinationPath, $fileName)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Impossible de déplacer le fichier vers le dossier de destination.'
                ], 500);
            }
            
            // URL de l'image (accessible via http://localhost:8000/images/products/filename.jpg)
            $imageUrl = '/images/products/' . $fileName;
            
            return response()->json([
                'success' => true,
                'message' => 'Image uploadée avec succès',
                'data' => [
                    'image_url' => $imageUrl,
                    'filename' => $fileName,
                ]
            ], 200);
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur de validation: ' . implode(', ', $e->errors()['image'] ?? ['Format ou taille de fichier invalide'])
            ], 422);
        } catch (\Exception $e) {
            \Log::error('Erreur upload image', [
                'message' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de l\'upload de l\'image: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Supprime une image de produit
     */
    public function deleteProductImage(Request $request)
    {
        $request->validate([
            'image_url' => 'required|string',
        ]);

        try {
            $imageUrl = $request->input('image_url');
            
            // Extraire le nom du fichier depuis l'URL
            $fileName = basename($imageUrl);
            $filePath = public_path('images/products/' . $fileName);
            
            // Supprimer le fichier s'il existe
            if (file_exists($filePath)) {
                unlink($filePath);
            }
            
            return response()->json([
                'success' => true,
                'message' => 'Image supprimée avec succès'
            ], 200);
            
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erreur lors de la suppression: ' . $e->getMessage()
            ], 500);
        }
    }
}

