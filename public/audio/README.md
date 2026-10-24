# 未提供の本番音声

本番音声はステージIDに対応するMP3として配置してください。自然な会話速度の米国英語による全文録音が必要です。

The little girl opened the wooden door and discovered a beautiful garden behind the house.

`stage-02.mp3`：

My brother found a small black cat under the old wooden bridge.

`stage-03.mp3`：

We waited for the morning train, but it never came to the station.

`stage-04.mp3`：

After school, my friends and I walked through the quiet park, where we found a small bridge beside the river.

`stage-05.mp3`：

On Saturday morning, our science teacher took us to the city museum, where we carefully studied ancient maps and listened to stories about distant travelers.

`src/stages.js` の各 `start: null` を元音声上の発話開始秒へ置換し、音声・時刻・分類を確認したら `verified: true` にします。0秒は元ファイルの先頭です。プリロール分を足さないでください。

仮デモの音はブラウザ内で生成するガイド音です。英文音声、TTS、録音された発話ではありません。本番音声の代替ではありません。

## 合成音声デモ

`stage-*-synthetic.wav` は米国英語Samanthaの全文合成音声です。生成条件と推定時刻は同名のJSON、ゲーム側の設定は `src/synthetic-demo.js` です。本番データとは分離しています。
