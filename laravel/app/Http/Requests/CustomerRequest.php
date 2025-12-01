<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CustomerRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $customerId = $this->route('cliente');

        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customer,email,' . $customerId,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string',
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
