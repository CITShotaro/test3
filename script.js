const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Expressのセットアップ
const app = express();
app.use(bodyParser.json()); // JSONリクエストのパース

// MongoDBに接続
mongoose.connect('mongodb://localhost:27017/english-bingo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// ユーザースキーマの定義
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    bingoState: Array,
    bingoCount: Number,
    bingoNumbers: Array
});

const User = mongoose.model('User', userSchema);

// ログイン処理
function login(username, password) {
    fetch('http://localhost:3000/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            // セッションにユーザー情報を保存
            sessionStorage.setItem('currentUser', JSON.stringify(data));
            console.log('ログイン成功:', data);
        } else {
            console.log('ユーザーが見つかりません');
        }
    })
    .catch((error) => {
        console.error('エラー:', error);
    });
}


// ユーザーデータの保存処理
function saveUserData(username, bingoState, bingoCount, bingoNumbers) {
    fetch('http://localhost:3000/save', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, bingoState, bingoCount, bingoNumbers }),
    })
    .then(response => response.json())
    .then(data => {
        console.log('ユーザーデータの保存成功:', data);
    })
    .catch((error) => {
        console.error('エラー:', error);
    });
}


// サーバーの起動
app.listen(3000, () => {
    console.log('サーバーがポート3000で稼働中');
});
