<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class SaleRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'customer_id' => 'required|exists:customer,id',
            'total' => 'required|numeric|min:0',
            'status' => 'required|in:pending,completed,cancelled',
            'product' => 'required|array|min:1',
            'product.*.id' => 'required|exists:product,id',
            'product.*.quantity' => 'required|integer|min:1',
            'product.*.price' => 'required|numeric|min:0',
        ];
    }

    public function messages()
    {
        return [
            'customer_id.required' => 'O cliente é obrigatório',
            'customer_id.exists' => 'Cliente não encontrado',
            'total.required' => 'O total é obrigatório',
            'total.numeric' => 'O total deve ser um número',
            'status.required' => 'O status é obrigatório',
            'status.in' => 'Status inválido',
            'product.required' => 'Deve haver pelo menos um produto',
            'product.*.id.exists' => 'Produto não encontrado',
            'product.*.quantity.min' => 'A quantidade deve ser no mínimo 1',
        ];
    }
}
