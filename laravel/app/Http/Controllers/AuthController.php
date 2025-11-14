<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class AuthController extends Controller
{
    public function registrar(Request $request)
    {
        $data = $request->validate([
            'nome'  => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'senha' => 'required|string|min:6',
        ]);

        $user = User::create([
            'name'     => $data['nome'],
            'email'    => $data['email'],
            'password' => bcrypt($data['senha']),
        ]);

        $token = $user->createToken('987')->plainTextToken;

        return response()->json([
            'user'  => $user,
            'token' => $token
        ], 201);
    }

    public function login(Request $request)
    {
        $dados = $request->validate([
            'email' => 'required|string|email',
            'senha' => 'required|string',
        ]);

        $usuario = User::where('email', $dados ['email'])->first();

        if (!$usuario || !Hash::check($dados['senha'], $usuario->password)) {
            return response()->json(['message'=> 'credenciais inválidas'], 401);
        }

        $token = $usuario->createToken('987')->plainTextToken;

        return response()->json([
        'user'  => $usuario,
        'token' => $token
            ], 200);


    }
    public function perfil(Request $request)
    {
        return response()->json($request->user(), 200);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Desconectado com sucesso'], 200);
    }
}
