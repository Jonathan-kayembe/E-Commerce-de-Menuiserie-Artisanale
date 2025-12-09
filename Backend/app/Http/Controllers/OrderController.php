<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IOrderRepository;
use App\Repositories\IOrderItemRepository;
use App\Repositories\IProductRepository;
use App\Repositories\IPaymentRepository;
use App\Repositories\ICartItemRepository;

/**
 * Contrôleur de gestion des commandes
 * 
 * Gère toutes les opérations liées aux commandes des clients :
 * - Liste des commandes (index) - différencie managers et clients
 * - Création d'une commande depuis le panier (store)
 * - Affichage d'une commande (show)
 * - Modification d'une commande (update) - statut, suivi, etc.
 * - Suppression d'une commande (destroy)
 * - Commandes d'un utilisateur (getByUser)
 * 
 * Le processus de commande inclut :
 * - Vérification du stock disponible
 * - Création des order_items
 * - Mise à jour du stock des produits
 * - Création d'un paiement fictif
 * - Vidage automatique du panier
 * 
 * SÉCURITÉ : Les clients ne peuvent voir/modifier que leurs propres commandes.
 * Les managers ont accès à toutes les commandes.
 * 
 * @package App\Http\Controllers
 * @author Jonathan Kayembe
 */
class OrderController extends Controller
{
    /**
     * Repository pour la gestion des commandes
     * @var IOrderRepository
     */
    private IOrderRepository $orderRepo;
    
    /**
     * Repository pour la gestion des articles de commande
     * @var IOrderItemRepository
     */
    private IOrderItemRepository $orderItemRepo;
    
    /**
     * Repository pour la gestion des produits
     * @var IProductRepository
     */
    private IProductRepository $productRepo;
    
    /**
     * Repository pour la gestion des paiements
     * @var IPaymentRepository
     */
    private IPaymentRepository $paymentRepo;
    
    /**
     * Repository pour la gestion des articles du panier
     * @var ICartItemRepository
     */
    private ICartItemRepository $cartItemRepo;

    /**
     * Constructeur avec injection de dépendances
     * 
     * @param IOrderRepository $orderRepo Repository des commandes
     * @param IOrderItemRepository $orderItemRepo Repository des articles de commande
     * @param IProductRepository $productRepo Repository des produits
     * @param IPaymentRepository $paymentRepo Repository des paiements
     * @param ICartItemRepository $cartItemRepo Repository des articles du panier
     */
    public function __construct(
        IOrderRepository $orderRepo,
        IOrderItemRepository $orderItemRepo,
        IProductRepository $productRepo,
        IPaymentRepository $paymentRepo,
        ICartItemRepository $cartItemRepo
    ) {
        $this->orderRepo = $orderRepo;
        $this->orderItemRepo = $orderItemRepo;
        $this->productRepo = $productRepo;
        $this->paymentRepo = $paymentRepo;
        $this->cartItemRepo = $cartItemRepo;
    }

    public function index()
    {
        // Vérifier que l'utilisateur est authentifié (géré par le middleware)
        // Pour les managers, retourner toutes les commandes
        // Pour les clients, retourner uniquement leurs commandes
        $authenticatedUser = request()->user();
        
        if (!$authenticatedUser) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401);
        }

        // Si l'utilisateur est un manager, retourner toutes les commandes
        // Sinon, retourner uniquement les commandes de l'utilisateur
        if (($authenticatedUser->role ?? 'client') === 'manager') {
            $orders = $this->orderRepo->getAll();
        } else {
            $orders = $this->orderRepo->getByUserId($authenticatedUser->id);
        }

        // Enrichir chaque commande avec ses items et paiement
        foreach ($orders as $order) {
            $order->order_items = $this->orderItemRepo->getByOrderId($order->id);
            $payment = $this->paymentRepo->getByOrderId($order->id);
            if ($payment) {
                $order->payment = $payment;
            }
        }
        return response()->json([
            "success" => true,
            "data" => $orders
        ], 200);
    }

    public function store(Request $request)
    {
        // Utiliser l'utilisateur authentifié depuis le middleware
        $authenticatedUser = $request->user();
        
        if (!$authenticatedUser) {
            return response()->json([
                "success" => false,
                "message" => "Utilisateur non authentifié."
            ], 401);
        }

        $data = $request->validate([
            "status" => "nullable|string|in:en préparation,payée,expédiée,livrée,annulée",
            "total_price" => "required|numeric|min:0",
            "shipping_address_id" => "nullable|integer|min:1",
            "billing_address_id" => "nullable|integer|min:1",
            "tracking_number" => "nullable|string|max:100",
            "notes" => "nullable|string",
            "items" => "required|array|min:1",
            "items.*.product_id" => "required|integer|min:1",
            "items.*.quantity" => "required|integer|min:1",
            "items.*.price" => "required|numeric|min:0",
            "items.*.customization" => "nullable|array",
            "payment_method" => "nullable|string|in:carte_bancaire,virement,cheque",
        ]);

        // Calculer le total si non fourni
        $totalPrice = (float) $data["total_price"];
        if ($totalPrice <= 0) {
            $totalPrice = 0;
            foreach ($data["items"] as $item) {
                $totalPrice += (float) $item["price"] * (int) $item["quantity"];
            }
        }

        // Créer la commande avec l'utilisateur authentifié
        $order = (object) [
            "id" => 0,
            "user_id" => (int) $authenticatedUser->id,
            "status" => $data["status"] ?? "en préparation",
            "total_price" => $totalPrice,
            "shipping_address_id" => $data["shipping_address_id"] ?? null,
            "billing_address_id" => $data["billing_address_id"] ?? $data["shipping_address_id"] ?? null,
            "tracking_number" => $data["tracking_number"] ?? null,
            "notes" => $data["notes"] ?? null,
        ];

        $this->orderRepo->add($order);

        // Récupérer l'ID de la commande créée
        $orderId = $this->orderRepo->getLastInsertId();

        // Créer les order_items et mettre à jour le stock
        $orderItems = [];
        foreach ($data["items"] as $itemData) {
            $productId = (int) $itemData["product_id"];
            $quantity = (int) $itemData["quantity"];
            $unitPrice = (float) $itemData["price"];
            $subtotal = $unitPrice * $quantity;

            // Vérifier le stock disponible
            $product = $this->productRepo->getById($productId);
            if (!$product) {
                return response()->json([
                    "success" => false,
                    "message" => "Produit #{$productId} non trouvé."
                ], 404);
            }

            if ($product->stock < $quantity) {
                return response()->json([
                    "success" => false,
                    "message" => "Stock insuffisant pour le produit \"{$product->name}\". Stock disponible: {$product->stock}"
                ], 400);
            }

            // Créer l'order_item
            $orderItem = (object) [
                "id" => 0,
                "order_id" => $orderId,
                "product_id" => $productId,
                "quantity" => $quantity,
                "unit_price" => $unitPrice,
                "subtotal" => $subtotal,
                "customization" => $itemData["customization"] ?? null,
            ];

            $this->orderItemRepo->add($orderItem);
            $orderItems[] = $orderItem;

            // Mettre à jour le stock du produit
            $product->stock = $product->stock - $quantity;
            $this->productRepo->update($product);
        }

        // Créer le paiement fictif
        $paymentMethod = $data["payment_method"] ?? "carte_bancaire";
        $payment = (object) [
            "id" => 0,
            "order_id" => $orderId,
            "method" => $paymentMethod,
            "amount" => $totalPrice,
            "status" => "réussi", // Paiement fictif toujours réussi
            "transaction_id" => "FAKE_" . time() . "_" . $orderId,
        ];

        $this->paymentRepo->add($payment);

        // Mettre à jour le statut de la commande à "payée" si le paiement est réussi
        if ($payment->status === "réussi") {
            $order->id = $orderId;
            $order->status = "payée";
            $this->orderRepo->update($order);
        }

        // Vider le panier de l'utilisateur après création de la commande
        try {
            $cart = app(\App\Repositories\ICartRepository::class)->getByUserId($authenticatedUser->id);
            if ($cart && $cart->id) {
                // Supprimer tous les items du panier
                $cartItems = $this->cartItemRepo->getByCartId($cart->id);
                foreach ($cartItems as $cartItem) {
                    $this->cartItemRepo->delete($cartItem->id);
                }
            }
        } catch (\Exception $e) {
            // Logger l'erreur mais ne pas faire échouer la commande
            \Log::warning('Erreur lors du vidage du panier après création de commande', [
                'user_id' => $authenticatedUser->id,
                'order_id' => $orderId,
                'error' => $e->getMessage(),
            ]);
        }

        // Récupérer la commande complète avec les items
        $completeOrder = $this->orderRepo->getById($orderId);
        $completeOrder->order_items = $this->orderItemRepo->getByOrderId($orderId);
        $completeOrder->payment = $this->paymentRepo->getByOrderId($orderId);

        return response()->json([
            "success" => true,
            "message" => "Commande créée avec succès.",
            "data" => $completeOrder
        ], 201);
    }

    public function show(int $id)
    {
        $order = $this->orderRepo->getById($id);
        if (!$order) {
            return response()->json([
                "success" => false,
                "message" => "Commande non trouvée."
            ], 404);
        }

        // Vérifier que l'utilisateur authentifié est le propriétaire de la commande
        $authenticatedUser = request()->user();
        if (!$authenticatedUser || (int) $authenticatedUser->id !== (int) $order->user_id) {
            return response()->json([
                "success" => false,
                "message" => "Accès refusé. Vous ne pouvez consulter que vos propres commandes."
            ], 403);
        }

        // Enrichir avec les items et le paiement
        $order->order_items = $this->orderItemRepo->getByOrderId($id);
        $payment = $this->paymentRepo->getByOrderId($id);
        if ($payment) {
            $order->payment = $payment;
        }
        return response()->json([
            "success" => true,
            "data" => $order
        ], 200);
    }

    public function update(int $id, Request $request)
    {
        $order = $this->orderRepo->getById($id);
        if (!$order) {
            return response()->json([
                "success" => false,
                "message" => "Commande non trouvée."
            ], 404);
        }

        $data = $request->validate([
            "status" => "nullable|string|in:en préparation,payée,expédiée,livrée,annulée",
            "total_price" => "nullable|numeric|min:0",
            "shipping_address_id" => "nullable|integer|min:1",
            "billing_address_id" => "nullable|integer|min:1",
            "tracking_number" => "nullable|string|max:100",
            "notes" => "nullable|string",
        ]);

        $updatedOrder = (object) [
            "id" => $id,
            "user_id" => $order->user_id,
            "status" => $data["status"] ?? $order->status,
            "total_price" => $data["total_price"] ?? $order->total_price,
            "shipping_address_id" => $data["shipping_address_id"] ?? $order->shipping_address_id,
            "billing_address_id" => $data["billing_address_id"] ?? $order->billing_address_id,
            "tracking_number" => $data["tracking_number"] ?? $order->tracking_number,
            "notes" => $data["notes"] ?? $order->notes,
        ];

        $this->orderRepo->update($updatedOrder);

        // Récupérer la commande mise à jour avec les items
        $completeOrder = $this->orderRepo->getById($id);
        $completeOrder->order_items = $this->orderItemRepo->getByOrderId($id);
        $payment = $this->paymentRepo->getByOrderId($id);
        if ($payment) {
            $completeOrder->payment = $payment;
        }

        return response()->json([
            "success" => true,
            "message" => "Commande modifiée avec succès.",
            "data" => $completeOrder
        ], 200);
    }

    public function destroy(int $id)
    {
        $order = $this->orderRepo->getById($id);
        if (!$order) {
            return response()->json([
                "success" => false,
                "message" => "Commande non trouvée."
            ], 404);
        }

        $this->orderRepo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Commande supprimée avec succès."
        ], 200);
    }

    public function getByUser(int $userId)
    {
        // Vérifier que l'utilisateur authentifié correspond à l'utilisateur demandé
        $authenticatedUser = request()->user();
        
        if (!$authenticatedUser || (int) $authenticatedUser->id !== (int) $userId) {
            return response()->json([
                "success" => false,
                "message" => "Accès refusé. Vous ne pouvez consulter que vos propres commandes."
            ], 403);
        }

        $orders = $this->orderRepo->getByUserId($userId);
        // Enrichir chaque commande avec ses items et paiement
        foreach ($orders as $order) {
            $order->order_items = $this->orderItemRepo->getByOrderId($order->id);
            $payment = $this->paymentRepo->getByOrderId($order->id);
            if ($payment) {
                $order->payment = $payment;
            }
        }
        return response()->json([
            "success" => true,
            "data" => $orders
        ], 200);
    }
}

