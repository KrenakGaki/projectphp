<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class CustomerRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules()
    {
        $customerId = $this->route('cliente');

        if ($this->isMethod('post')) {
            return [
                'name' => 'required|string|max:255',
                'email' => ['required', 'email', Rule::unique('customer', 'email')],
                'cpf' => ['nullable', 'cpf', Rule::unique('customer', 'cpf')],
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
            ];
        }

        return [
            'name' => 'sometimes|string|max:255',
            'email' => ['sometimes', 'email', Rule::unique('customer', 'email')->ignore($customerId)],
            'cpf' => ['sometimes', 'cpf', Rule::unique('customer', 'cpf')->ignore($customerId)],
            'phone' => 'sometimes|string',
            'address' => 'sometimes|string',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'O email deve ser válido',
            'email.unique' => 'Este email já está cadastrado',
        ];
    }
}
