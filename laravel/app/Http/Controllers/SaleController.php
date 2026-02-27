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
            $sale = $this->saleService->createSale($request->validated(), $request->user()->id);
            return $this->success($sale, 'Venda realizada com sucesso!', 201);
        } catch (Exception $e) {
            return $this->handleError($e);
        }
    }

    public function show($id): JsonResponse
    {
        try {
            $sale = $this->saleService->getSaleById($id);
            return response()->json($sale);
        } catch (Exception $e) {
            return $this->handleError($e);
        }
    }

    public function destroy($id): JsonResponse
    {   
        try {
            $this->saleService->cancelSale($id);
            return $this->success(null, 'Venda cancelada com sucesso!');
        } catch (Exception $e) {
            return $this->handleError($e);
        }
    }

    private function success($data, string $message, int $code = 200): JsonResponse
    {
        return response()->json([
            'success' => true,
            'message' => $message,
            'data' => $data
        ], $code);
    }

    private function handleError(Exception $e): JsonResponse
    {
        $statusCode = match(get_class($e)) {
            ProductNotFoundException::class, SaleNotFoundException::class => 404,
            InsufficientStockException::class => 422,
            default => 500
        };

        return response()->json([
            'success' => false,
            'message' => $e->getMessage()
        ], $statusCode);
    }
}