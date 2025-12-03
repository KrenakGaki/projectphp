<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Customer;
use App\Models\Product;
use App\Models\Sale;

class DashboardController extends Controller
{
    public function index () {
        return response()->json([
            'totalClientes' => Customer::count(),
            'totalProdutos' => Product::count(),
            'totalVendas' => Sale::count(),
            'valorVendas' => Sale::sum('total'),
        ]);
    }
}
