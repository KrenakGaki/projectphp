<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Login</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
        }

        .login-container {
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
            width: 100%;
            max-width: 400px;
        }

        h2 {
            text-align: center;
            color: #333;
            margin-bottom: 30px;
        }

        .form-group {
            margin-bottom: 20px;
        }

        label {
            display: block;
            margin-bottom: 5px;
            color: #555;
            font-weight: 500;
        }

        input {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            transition: border-color 0.3s;
        }

        input:focus {
            outline: none;
            border-color: #667eea;
        }

        .error {
            color: #e74c3c;
            font-size: 12px;
            margin-top: 5px;
            display: none;
        }

        .error.show {
            display: block;
        }

        button {
            width: 100%;
            padding: 12px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s;
        }

        button:hover {
            transform: translateY(-2px);
        }

        button:disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }

        .alert {
            padding: 12px;
            border-radius: 5px;
            margin-bottom: 20px;
            display: none;
        }

        .alert.show {
            display: block;
        }

        .alert-success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }

        .alert-error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }

        .loading {
            display: none;
            text-align: center;
            margin-top: 10px;
        }

        .loading.show {
            display: block;
        }
    </style>
</head>
<body>
    <div class="login-container">
        <h2>🔐 Login</h2>

        <div id="alert" class="alert"></div>

        <form id="loginForm">
            <div class="form-group">
                <label for="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="seu@email.com"
                    required
                >
                <span class="error" id="emailError"></span>
            </div>

            <div class="form-group">
                <label for="password">Senha</label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    required
                >
                <span class="error" id="passwordError"></span>
            </div>

            <button type="submit" id="submitBtn">Entrar</button>
            <div class="loading" id="loading">Carregando...</div>
        </form>
    </div>

    <script>
        const form = document.getElementById('loginForm');
        const submitBtn = document.getElementById('submitBtn');
        const loading = document.getElementById('loading');
        const alert = document.getElementById('alert');

        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Limpar erros anteriores
            clearErrors();

            // Desabilitar botão
            submitBtn.disabled = true;
            loading.classList.add('show');

            // Pegar dados do formulário
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('http://localhost:8000/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    // Login bem-sucedido
                    showAlert('Login realizado com sucesso! Redirecionando...', 'success');

                    // Salvar token no localStorage
                    localStorage.setItem('auth_token', data.data.token);
                    localStorage.setItem('user', JSON.stringify(data.data.user));

                    // Redirecionar após 1 segundo
                    setTimeout(() => {
                        window.location.href = '/dashboard'; // Ajuste para sua rota
                    }, 1000);
                } else {
                    // Erro de validação ou credenciais
                    if (data.errors) {
                        // Mostrar erros de validação
                        Object.keys(data.errors).forEach(key => {
                            const errorElement = document.getElementById(key + 'Error');
                            if (errorElement) {
                                errorElement.textContent = data.errors[key][0];
                                errorElement.classList.add('show');
                            }
                        });
                    }

                    showAlert(data.message || 'Erro ao fazer login', 'error');
                }
            } catch (error) {
                showAlert('Erro ao conectar com o servidor', 'error');
                console.error('Erro:', error);
            } finally {
                submitBtn.disabled = false;
                loading.classList.remove('show');
            }
        });

        function showAlert(message, type) {
            alert.textContent = message;
            alert.className = `alert alert-${type} show`;

            setTimeout(() => {
                alert.classList.remove('show');
            }, 5000);
        }

        function clearErrors() {
            document.querySelectorAll('.error').forEach(error => {
                error.classList.remove('show');
                error.textContent = '';
            });
            alert.classList.remove('show');
        }
    </script>
</body>
</html>
