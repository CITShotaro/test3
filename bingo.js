document.addEventListener('DOMContentLoaded', () => {
    // shuffleArray関数の定義
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
    let bingoState = currentUser.bingoState || Array(25).fill(false); // 各マスの状態を保存（初期状態はすべてfalse）
    let bingoCount = currentUser.bingoCount || 0; // BINGOのカウント
    let shuffledNumbers;

    // 現在のユーザー情報を更新する関数を定義
    const saveCurrentUser = () => {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);

        if (userIndex !== -1) {
            users[userIndex] = currentUser;
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
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
                if (bingoState[cellIndex]) { // `bingoState` はシャッフル後のインデックスで管理する
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
        bingoState[index] = true; // マスをクリックしたらそのマスを正解とする
        currentUser.bingoState = bingoState; // 状態を更新
        saveCurrentUser(); // ユーザー情報を保存
        generateBingoCard(); // カードを再生成して色を更新
        checkBingo(); // BINGO判定を実行
    };

    // BINGOの判定
    const checkBingo = () => {
        let newBingoCount = 0;

        const checkLine = (line) => line.every(index => bingoState[index]); // すべてのマスが正解しているかを確認

        // 横のチェック
        for (let i = 0; i < 5; i++) {
            const row = [i * 5, i * 5 + 1, i * 5 + 2, i * 5 + 3, i * 5 + 4];
            if (checkLine(row)) newBingoCount++;
        }

        // 縦のチェック
        for (let i = 0; i < 5; i++) {
            const column = [i, i + 5, i + 10, i + 15, i + 20];
            if (checkLine(column)) newBingoCount++;
        }

        // 斜めのチェック
        const diagonal1 = [0, 6, 12, 18, 24]; // 左上から右下
        const diagonal2 = [4, 8, 12, 16, 20]; // 右上から左下
        if (checkLine(diagonal1)) newBingoCount++;
        if (checkLine(diagonal2)) newBingoCount++;

        if (newBingoCount > bingoCount) {
            bingoCount = newBingoCount;
            updateBingoCount();
            saveCurrentUser(); // ユーザーデータの更新
        }
    };

    // BINGOカウントの更新
    const updateBingoCount = () => {
        bingoCountElement.textContent = bingoCount;
    };

    generateBingoCard(); // 初回のBINGOカード生成
    updateBingoCount(); // 初期状態のBINGOカウントを表示
});
