<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Listar todos os usuários
     */
    public function index()
    {
        try {
            $users = User::select('id', 'name', 'email', 'type', 'created_at')
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($users, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao buscar usuários',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Criar novo usuário
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:6',
                'type' => ['required', Rule::in(['admin', 'user'])],
            ], [
                'name.required' => 'O nome é obrigatório',
                'email.required' => 'O email é obrigatório',
                'email.email' => 'Email inválido',
                'email.unique' => 'Este email já está cadastrado',
                'password.required' => 'A senha é obrigatória',
                'password.min' => 'A senha deve ter no mínimo 6 caracteres',
                'type.required' => 'O tipo de usuário é obrigatório',
                'type.in' => 'Tipo de usuário inválido',
            ]);

            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'type' => $validated['type'],
            ]);

            return response()->json([
                'message' => 'Usuário criado com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'type' => $user->type,
                ]
            ], 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao criar usuário',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Exibir um usuário específico
     */
    public function show(string $id)
    {
        try {
            $user = User::select('id', 'name', 'email', 'type', 'created_at')
                ->findOrFail($id);

            return response()->json($user, 200);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Usuário não encontrado'
            ], 404);
        }
    }

    /**
     * Atualizar usuário
     */
    public function update(Request $request, string $id)
    {
        try {
            $user = User::findOrFail($id);

            $validated = $request->validate([
                'name' => 'sometimes|required|string|max:255',
                'email' => [
                    'sometimes',
                    'required',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id)
                ],
                'password' => 'sometimes|nullable|string|min:6',
                'type' => ['sometimes', 'required', Rule::in(['admin', 'user'])],
            ], [
                'name.required' => 'O nome é obrigatório',
                'email.required' => 'O email é obrigatório',
                'email.email' => 'Email inválido',
                'email.unique' => 'Este email já está cadastrado',
                'password.min' => 'A senha deve ter no mínimo 6 caracteres',
                'type.in' => 'Tipo de usuário inválido',
            ]);

            // Atualizar campos
            if (isset($validated['name'])) {
                $user->name = $validated['name'];
            }

            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }

            if (isset($validated['type'])) {
                $user->type = $validated['type'];
            }

            // Só atualiza a senha se foi fornecida
            if (!empty($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }

            $user->save();

            return response()->json([
                'message' => 'Usuário atualizado com sucesso',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'type' => $user->type,
                ]
            ], 200);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Erro de validação',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao atualizar usuário',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Excluir usuário
     */
    public function destroy(string $id)
    {
        try {
            $user = User::findOrFail($id);

            // Impedir que o usuário exclua a si mesmo
            // if (auth()->id() === $user->id) {
            //     return response()->json([
            //         'error' => 'Você não pode excluir seu próprio usuário'
            //     ], 403);
            // }

            $user->delete();

            return response()->json([
                'message' => 'Usuário excluído com sucesso'
            ], 200);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Erro ao excluir usuário',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
