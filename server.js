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

// ユーザーログイン処理
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username, password }, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).send('ユーザーが見つかりません');
        res.send(user); // ログイン成功時にユーザーデータを返す
    });
});

// ユーザーデータの保存処理
app.post('/save', (req, res) => {
    const { username, bingoState, bingoCount, bingoNumbers } = req.body;

    User.findOneAndUpdate(
        { username },
        { bingoState, bingoCount, bingoNumbers },
        { new: true, upsert: true },
        (err, user) => {
            if (err) return res.status(500).send(err);
            res.send(user); // 保存・更新後のユーザーデータを返す
        }
    );
});

// サーバーの起動
app.listen(3000, () => {
    console.log('サーバーがポート3000で稼働中');
});
