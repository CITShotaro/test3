document.addEventListener('DOMContentLoaded', () => {
    // 配列をランダムにシャッフルする関数
    const shuffleArray = (array) => {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // 配列の要素を入れ替え
        }
        return array;
    };

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
    let shuffledNumbers;

    // 現在のユーザー情報を保存する関数
    const saveCurrentUser = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);

        if (userIndex !== -1) {
            users[userIndex] = currentUser;
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };

    // BINGOカウントを増やす関数
    const checkBingo = () => {
        const lines = [
            // 横のライン
            [0, 1, 2, 3, 4],
            [5, 6, 7, 8, 9],
            [10, 11, 12, 13, 14],
            [15, 16, 17, 18, 19],
            [20, 21, 22, 23, 24],
            // 縦のライン
            [0, 5, 10, 15, 20],
            [1, 6, 11, 16, 21],
            [2, 7, 12, 17, 22],
            [3, 8, 13, 18, 23],
            [4, 9, 14, 19, 24],
            // 斜めのライン
            [0, 6, 12, 18, 24],
            [4, 8, 12, 16, 20]
        ];

        let newBingoCount = 0;

        // 各ラインをチェックして、成立しているラインをカウント
        lines.forEach((line, lineIndex) => {
            const isBingo = line.every(index => bingoState[index]); // 各ラインのマスが全てtrueか確認
            console.log(`ライン${lineIndex + 1}:`, isBingo ? 'BINGO成立' : 'BINGO未成立'); // デバッグ情報
            if (isBingo) {
                newBingoCount++;
            }
        });

        console.log('新しいBINGOカウント:', newBingoCount); // 新しいBINGOカウントの確認

        // BINGOカウントの更新
        if (newBingoCount > bingoCount) {
            console.log('BINGOカウントを更新します');
            bingoCount = newBingoCount;
            currentUser.bingoCount = bingoCount;
            updateBingoCount(); // UIのカウントを更新
            saveCurrentUser(); // ユーザー情報を保存
        } else {
            console.log('BINGOカウントの更新は不要です');
        }
    };

    // ユーザーにシャッフル済みの番号が保存されているか確認
    if (currentUser.bingoNumbers) {
        shuffledNumbers = currentUser.bingoNumbers; // 保存された番号を使用
    } else {
        // 保存された番号がない場合、シャッフルして設定
        const numbers = Array.from({ length: 25 }, (_, i) => i + 1); // [1, 2, 3, ..., 25]
        shuffledNumbers = shuffleArray(numbers);
        currentUser.bingoNumbers = shuffledNumbers; // シャッフルされた番号をユーザーに保存
        saveCurrentUser(); // ユーザー情報を更新
    }

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
                if (bingoState[number - 1]) {
                    cell.classList.add('correct-cell'); // 正解済みのマスに適用するCSSクラス
                } else {
                    cell.addEventListener('click', () => handleCellClick(number - 1)); // 未正解マスのみクリック可能
                }

                row.appendChild(cell);
            }
            bingoCard.appendChild(row);
        }

        console.log('BINGOカードを生成し、BINGO成立の確認を行います'); // デバッグ情報
        checkBingo(); // BINGO成立の確認を追加
    };

    // マスクリック時の処理
    const handleCellClick = (index) => {
        localStorage.setItem('currentCellIndex', index); // 選択したマスの番号を保存
        window.location.href = 'question.html'; // 問題画面に遷移
    };

    // BINGOカウントの表示を更新
    const updateBingoCount = () => {
        console.log('現在のBINGOカウント:', bingoCount); // デバッグ情報
        bingoCountElement.textContent = bingoCount; // BINGOカウントを画面に反映
    };

    generateBingoCard(); // BINGOカードを生成
    updateBingoCount();  // 初期BINGOカウントを画面に反映
});
