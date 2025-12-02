<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Repositories\IPaymentRepository;

class PaymentController extends Controller
{
    private IPaymentRepository $repo;

    public function __construct(IPaymentRepository $repo)
    {
        $this->repo = $repo;
    }

    public function getByOrder(int $orderId)
    {
        $payment = $this->repo->getByOrderId($orderId);
        if (!$payment) {
            return response()->json([
                "success" => false,
                "message" => "Paiement non trouvé."
            ], 404);
        }
        return response()->json([
            "success" => true,
            "data" => $payment
        ], 200);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            "order_id" => "required|integer|min:1",
            "method" => "required|string|in:carte_bancaire,virement,cheque",
            "amount" => "required|numeric|min:0",
            "status" => "nullable|string|in:en attente,réussi,échoué,annulé",
            "transaction_id" => "nullable|string|max:255",
        ]);

        $payment = (object) [
            "id" => 0,
            "order_id" => (int) $data["order_id"],
            "method" => $data["method"],
            "amount" => (float) $data["amount"],
            "status" => $data["status"] ?? "en attente",
            "transaction_id" => $data["transaction_id"] ?? null,
        ];

        $this->repo->add($payment);

        return response()->json([
            "success" => true,
            "message" => "Paiement ajouté avec succès.",
            "data" => $payment
        ], 201);
    }

    public function update(int $id, Request $request)
    {
        $payment = $this->repo->getById($id);
        if (!$payment) {
            return response()->json([
                "success" => false,
                "message" => "Paiement non trouvé."
            ], 404);
        }

        $data = $request->validate([
            "method" => "nullable|string|in:carte_bancaire,virement,cheque",
            "amount" => "nullable|numeric|min:0",
            "status" => "nullable|string|in:en attente,réussi,échoué,annulé",
            "transaction_id" => "nullable|string|max:255",
        ]);

        $payment = (object) [
            "id" => $id,
            "order_id" => $payment->order_id,
            "method" => $data["method"] ?? $payment->method,
            "amount" => $data["amount"] ?? $payment->amount,
            "status" => $data["status"] ?? $payment->status,
            "transaction_id" => $data["transaction_id"] ?? $payment->transaction_id,
        ];

        $this->repo->update($payment);

        return response()->json([
            "success" => true,
            "message" => "Paiement modifié avec succès.",
            "data" => $payment
        ], 200);
    }

    public function destroy(int $id)
    {
        $payment = $this->repo->getById($id);
        if (!$payment) {
            return response()->json([
                "success" => false,
                "message" => "Paiement non trouvé."
            ], 404);
        }

        $this->repo->delete($id);

        return response()->json([
            "success" => true,
            "message" => "Paiement supprimé avec succès."
        ], 200);
    }
}

