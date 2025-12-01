<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;

class ProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        $rules = [
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'cost_price' => 'required|numeric|min:0',
            'sale_price' => 'required|numeric|min:0',
            'quantity' => 'required|integer|min:0',
        ];


        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = [
                'name' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|nullable|string',
                'cost_price' => 'sometimes|required|numeric|min:0',
                'sale_price' => 'sometimes|required|numeric|min:0',
                'quantity' => 'sometimes|required|integer|min:0',
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'name.required' => 'O nome do produto é obrigatório',
            'name.max' => 'O nome não pode ter mais de 255 caracteres',
            'cost_price.required' => 'O preço de custo é obrigatório',
            'cost_price.numeric' => 'O preço de custo deve ser um número',
            'cost_price.min' => 'O preço de custo não pode ser negativo',
            'sale_price.required' => 'O preço de venda é obrigatório',
            'sale_price.numeric' => 'O preço de venda deve ser um número',
            'sale_price.min' => 'O preço de venda não pode ser negativo',
            'quantity.required' => 'A quantidade é obrigatória',
            'quantity.integer' => 'A quantidade deve ser um número inteiro',
            'quantity.min' => 'A quantidade não pode ser negativa',
        ];
    }

    protected function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(
            response()->json([
                'success' => false,
                'message' => 'Erro de validação',
                'errors' => $validator->errors()
            ], 422)
        );
    }
}
