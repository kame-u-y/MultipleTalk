# MultipleTalk (WIP)

<img width="450px" alt="スクリーンショット 2021-02-04 4 41 27" src="https://user-images.githubusercontent.com/20572112/106800114-6a0ef680-66a3-11eb-9977-c6e8bbc17b2f.png">　<img width="450px" alt="スクリーンショット 2021-02-04 2 56 58" src="https://user-images.githubusercontent.com/20572112/106793677-1bf5f500-669b-11eb-8f51-f6b3ba2e34a8.png">

ボイスチャットによる内緒話をサポートする通話アプリ

<br>

## アプリのページ

[MultipleTalk](https://kame-v-d.github.io/MultipleTalk/)

<br>

## 動作環境

- 現状PCのみで音像定位処理が動作

- Chromeで動作確認

<br>

## 使用技術等

- 言語：TypeScript、React Hooks

- WebRTC：SkyWay

- 音像定位：ResonanceAudio

<br>

## 使用方法

### Home

<img width="480px" alt="スクリーンショット 2021-02-04 3 54 29" src="https://user-images.githubusercontent.com/20572112/106794910-c91d3d00-669c-11eb-85c6-cc01afff8925.png">

Room NameとDisplay Nameを設定して入室

- Room Name：入室する通話部屋名

- Display Name：自分の表示名

### Talk Room

<img width="480px" alt="スクリーンショット 2021-02-04 4 41 27" src="https://user-images.githubusercontent.com/20572112/106800114-6a0ef680-66a3-11eb-9977-c6e8bbc17b2f.png">

ボイスとテキストによるチャットが可能

マイクボタンのクリックで、それぞれのマイクのオン/オフを切替

<img width="480px" alt="スクリーンショット 2021-02-04 4 33 00" src="https://user-images.githubusercontent.com/20572112/106799043-1cde5500-66a2-11eb-8d51-e994b31cf649.png">

新たにユーザが入室したとき、そのユーザとだけのチャットが生成される

<br>

## モチベーション

パラノイアTRPGでのUV(GM)との内緒話をボイスチャットで行いたい

- パラノイア ... プレイヤ対立型のTRPG

  - 周りのプレイヤにバレないように行動を起こすことが推奨

  - 伝達情報を制限できるオンラインセッションが好まれている

  - 通常、内緒話は表の会話を妨げないようにテキストチャットで行われる
    
→ 周りにバレないように、自然にその音声が内緒話だとわかることが必要

- 聴覚は音によってモノの動きを感知する優れたセンサ
  
→ 内緒話と通常の会話が混ざらないようにすることが必要

- 同時に流れる音声は空間的に分離すると聞き取りやすくなる

<br>

## 実装状況

- [x] 入室時の処理

- [x] Resonance Audioによる音像定位（PC & Chrome）

- [ ] メインの通話での現在発言者の表示

- [ ] スマートフォンでの音像定位

- [x] テキストチャットの送受信

- [ ] テキスト送信者の表示

- [ ] 退室時の処理

