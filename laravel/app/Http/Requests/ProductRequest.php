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
            'nome' => 'required|string|max:255',
            'descricao' => 'nullable|string',
            'preco_custo' => 'required|numeric|min:0',
            'preco_venda' => 'required|numeric|min:0',
            'quantidade' => 'required|integer|min:0',
        ];

        // Se for update, torna os campos opcionais
        if ($this->isMethod('PUT') || $this->isMethod('PATCH')) {
            $rules = [
                'nome' => 'sometimes|required|string|max:255',
                'descricao' => 'sometimes|nullable|string',
                'preco_custo' => 'sometimes|required|numeric|min:0',
                'preco_venda' => 'sometimes|required|numeric|min:0',
                'quantidade' => 'sometimes|required|integer|min:0',
            ];
        }

        return $rules;
    }

    public function messages(): array
    {
        return [
            'nome.required' => 'O nome do produto é obrigatório',
            'nome.max' => 'O nome não pode ter mais de 255 caracteres',
            'preco_custo.required' => 'O preço de custo é obrigatório',
            'preco_custo.numeric' => 'O preço de custo deve ser um número',
            'preco_custo.min' => 'O preço de custo não pode ser negativo',
            'preco_venda.required' => 'O preço de venda é obrigatório',
            'preco_venda.numeric' => 'O preço de venda deve ser um número',
            'preco_venda.min' => 'O preço de venda não pode ser negativo',
            'quantidade.required' => 'A quantidade é obrigatória',
            'quantity.integer' => 'A quantidade deve ser um número inteiro',
            'quantidade.min' => 'A quantidade não pode ser negativa',
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
