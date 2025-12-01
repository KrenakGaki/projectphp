<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('user');

        $rules = [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $userId,
            'type' => 'required|in:admin,user',
        ];


        if ($this->isMethod('post')) {
            $rules['password'] = 'required|string|min:6';
        } else {

            $rules['password'] = 'nullable|string|min:6';
        }

        return $rules;
    }

    public function messages()
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'O email deve ser válido',
            'email.unique' => 'Este email já está cadastrado',
            'password.required' => 'A senha é obrigatória',
            'password.min' => 'A senha deve ter no mínimo 8 caracteres',
            'type.required' => 'O tipo é obrigatório',
            'type.in' => 'O tipo deve ser admin ou user',
        ];
    }
}
