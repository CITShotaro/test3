document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');

    // ログイン処理
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value.trim();
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // ユーザー情報を検索
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                // ログイン成功
                localStorage.setItem('currentUser', JSON.stringify(user));
                window.location.href = 'bingo.html'; // ログイン成功後にBINGO画面へ
            } else {
                // ログイン失敗時のエラーメッセージ表示
                document.getElementById('login-error').innerText = 'ユーザーIDまたはパスワードが間違っています。';
            }
        });
    }

    // 新規登録処理
    if (registerForm) {
        registerForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value.trim();
            const users = JSON.parse(localStorage.getItem('users')) || [];

            // 既に同じユーザー名が登録されているか確認
            if (users.some(user => user.username === username)) {
                document.getElementById('register-error').innerText = 'このユーザーIDは既に使用されています。';
            } else {
                // 新しいユーザーを登録（BINGOカードの初期状態を設定）
                const newUser = { 
                    username, 
                    password, 
                    bingoState: Array(25).fill(false), // 25マスの初期状態
                    bingoCount: 0 
                };
                users.push(newUser);
                localStorage.setItem('users', JSON.stringify(users)); // 全ユーザー情報を保存
                alert('登録が完了しました。ログインしてください。');
                window.location.href = 'index.html'; // ログイン画面にリダイレクト
            }
        });
    }
});
