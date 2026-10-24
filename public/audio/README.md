# 未提供の本番音声

ここに `stage-01.mp3` を配置してください。自然な会話速度の米国英語で次の全文を録音したものが必要です。

The little girl opened the wooden door and discovered a beautiful garden behind the house.

`src/stages.js` の各 `start: null` を元音声上の発話開始秒へ置換し、音声・時刻・分類を確認したら `verified: true` にします。0秒は元ファイルの先頭です。プリロール分を足さないでください。

仮デモの音はブラウザ内で生成するガイド音です。英文音声、TTS、録音された発話ではありません。本番音声の代替ではありません。

## 合成音声デモ

`stage-01-synthetic.wav` は米国英語Samanthaの全文合成音声です。初期モードで再生します。生成条件と推定時刻は `stage-01-synthetic.json`、ゲーム側の設定は `src/synthetic-demo.js` です。本番データとは分離しています。
