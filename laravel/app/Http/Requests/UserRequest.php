<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        $userId = $this->route('user');

        if ($this->isMethod('POST')) {
        $rules = [
            'name' => 'required|string|max:255',
            'email' => ['required','email',Rule::unique('users','email')->ignore($userId)],
            'password' => 'required|string|min:6',
            'type' => 'required|in:admin,user',
        ];
    }

        return [
        'name' => 'sometimes|string|max:255',
        'email' => ['sometimes','email',Rule::unique('users','email')->ignore($userId)],
        'password' => 'sometimes|string|min:6',
        'type' => 'sometimes|in:admin,user',
        ];
    }

    public function messages()
    {
        return [
            'name.required' => 'O nome é obrigatório',
            'email.required' => 'O email é obrigatório',
            'email.email' => 'O email deve ser válido',
            'email.unique' => 'Este email já está cadastrado',
            'password.required' => 'A senha é obrigatória',
            'password.min' => 'A senha deve ter no mínimo 6 caracteres',
            'type.required' => 'O tipo é obrigatório',
            'type.in' => 'O tipo deve ser admin ou user',
        ];
    }
}
