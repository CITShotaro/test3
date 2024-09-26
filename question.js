const loadQuestionsFromCSV = async () => {
    try {
        const response = await fetch('questions.csv');
        const data = await response.text();
        const lines = data.split('\n').slice(1); // ヘッダーを除去
        
        return lines.map(line => {
            // 各行をカンマで分割し、要素を取得
            const [question, correct, option1, option2, option3, option4] = line.split(',');

            // 各要素が undefined でないか確認
            if (!question || !correct || !option1 || !option2 || !option3 || !option4) {
                console.warn('不完全なデータをスキップ:', line);
                return null; // 不完全な行は無視する
            }

            // 各要素の前後の空白を削除し、オブジェクトを返す
            return {
                question: question.trim(),
                correct: correct.trim(),
                options: [option1.trim(), option2.trim(), option3.trim(), option4.trim()]
            };
        }).filter(q => q !== null); // null をフィルタリング
    } catch (error) {
        console.error('CSVの読み込みに失敗しました:', error);
        return [];
    }
};


document.addEventListener('DOMContentLoaded', async () => {
    const questionText = document.getElementById('question-text');
    const optionsContainer = document.getElementById('options');
    const feedback = document.getElementById('feedback');
    const nextQuestionButton = document.getElementById('next-question');

    let currentQuestionIndex = 0;
    let correctAnswers = 0;
    const totalQuestions = 3;

    const cellIndex = parseInt(localStorage.getItem('currentCellIndex'), 10) || 0;
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    if (!currentUser) {
        alert('ログインしてください。');
        window.location.href = 'index.html'; // ログイン画面にリダイレクト
        return;
    }

    const allQuestions = await loadQuestionsFromCSV();
    const questions = allQuestions.slice(cellIndex * totalQuestions, (cellIndex + 1) * totalQuestions);

    if (questions.length === 0) {
        alert('問題データが読み込まれていません。CSVファイルの配置と読み込みパスを確認してください。');
        return;
    }

    const loadQuestion = (index) => {
        const question = questions[index];
        questionText.textContent = question.question;
        optionsContainer.innerHTML = '';
        feedback.textContent = '';
        feedback.classList.remove('correct');

        question.options.forEach(option => {
            const button = document.createElement('button');
            button.textContent = option;
            button.classList.add('option-button');
            button.addEventListener('click', () => checkAnswer(option, question.correct));
            optionsContainer.appendChild(button);
        });
    };

    const checkAnswer = (selected, correct) => {
        if (selected === correct) {
            correctAnswers++;
            feedback.textContent = '正解です！';
            feedback.classList.add('correct');
        } else {
            feedback.textContent = `不正解です。正解は ${correct} です。`;
        }
        nextQuestionButton.disabled = false;
    };

    const completeQuestions = () => {
        if (correctAnswers === totalQuestions) {
            alert('3問全て正解です！このマスの色が変わります。');
            updateBingoCellState(cellIndex);
        } else {
            alert('終了です。結果によりマスの色は変わりません。');
        }
        window.location.href = 'bingo.html';
    };

    const updateBingoCellState = (index) => {
        currentUser.bingoState[index] = true;
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const userIndex = users.findIndex(user => user.username === currentUser.username);

        if (userIndex !== -1) {
            users[userIndex] = currentUser;
        }

        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
    };

    nextQuestionButton.addEventListener('click', () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            currentQuestionIndex++;
            loadQuestion(currentQuestionIndex);
            nextQuestionButton.disabled = true;
        } else {
            completeQuestions();
        }
    });

    loadQuestion(currentQuestionIndex);
    nextQuestionButton.disabled = true;
});
