document.addEventListener('DOMContentLoaded', () => {
    const bingoCard = document.getElementById('bingo-card');
    const bingoCountElement = document.getElementById('bingo-count');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('ログインしてください。');
        window.location.href = 'index.html'; // ログイン画面にリダイレクト
        return;
    }

    // BINGOカードの状態を管理する配列（現在のユーザーの状態を取得）
    let bingoState = currentUser.bingoState || Array(25).fill(false);
    let bingoCount = currentUser.bingoCount || 0;

    // 1から25の数字を生成してシャッフルする
    const numbers = Array.from({ length: 25 }, (_, i) => i + 1); // [1, 2, 3, ..., 25]
    const shuffledNumbers = shuffleArray(numbers);

    // BINGOカードの生成
    const generateBingoCard = () => {
        bingoCard.innerHTML = ''; // カードを初期化
        for (let i = 0; i < 5; i++) {
            const row = document.createElement('div');
            row.classList.add('bingo-row');
            for (let j = 0; j < 5; j++) {
                const cell = document.createElement('div');
                cell.classList.add('bingo-cell');
                const cellIndex = i * 5 + j;
                const number = shuffledNumbers[cellIndex]; // シャッフルされた数字を取得
                cell.textContent = `${number}`; // ランダムな番号を表示

                // カード状態に基づき、正解済みのマスの色を変える
                if (bingoState[cellIndex]) {
                    cell.classList.add('correct-cell'); // 正解済みのマスに適用するCSSクラス
                } else {
                    cell.addEventListener('click', () => handleCellClick(cellIndex)); // 未正解マスのみクリック可能
                }

                row.appendChild(cell);
            }
            bingoCard.appendChild(row);
        }
    };

    // マスクリック時の処理
    const handleCellClick = (index) => {
        localStorage.setItem('currentCellIndex', index); // 選択したマスの番号を保存
        window.location.href = 'question.html'; // 問題画面に遷移
    };

    // BINGOカウントの更新
    const updateBingoCount = () => {
        bingoCountElement.textContent = bingoCount;
    };

    // 現在のユーザー情報を更新
    const saveCurrentUser = () => {
        currentUser.bingoState = bingoState;
        currentUser.bingoCount = bingoCount;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);

        if (userIndex !== -1) {
            users[userIndex] = currentUser;
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };

    generateBingoCard();
    updateBingoCount();
});
