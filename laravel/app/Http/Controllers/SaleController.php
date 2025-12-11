<?php

namespace App\Http\Controllers;

use App\Http\Requests\SaleRequest;
use App\Services\SaleService;
use App\Exceptions\ProductNotFoundException;
use App\Exceptions\InsufficientStockException;
use App\Exceptions\SaleNotFoundException;
use Illuminate\Http\JsonResponse;
use Exception;

class SaleController extends Controller
{
    protected $saleService;

    public function __construct(SaleService $saleService)
    {
        $this->saleService = $saleService;
    }

    public function index(): JsonResponse
    {
        $sales = $this->saleService->getAllSales();
        return response()->json($sales);
    }

    public function store(SaleRequest $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $sale = $this->saleService->createSale($data, $request->user()->id);
            
            return response()->json([
                'success' => true,
                'message' => 'Venda realizada com sucesso!',
                'data'    => $sale
            ], 201);
            
        } catch (ProductNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
            
        } catch (InsufficientStockException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 422);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao processar venda: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $sale = $this->saleService->getSaleById($id);
            return response()->json($sale);
            
        } catch (SaleNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao buscar venda: ' . $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        try {
            $this->saleService->cancelSale($id);
            
            return response()->json([
                'success' => true,
                'message' => 'Venda cancelada com sucesso!'
            ]);
            
        } catch (SaleNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
            
        } catch (Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Erro ao cancelar venda: ' . $e->getMessage()
            ], 500);
        }
    }
}