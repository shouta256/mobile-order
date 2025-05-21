# 🍔 Mobile‑Order (Next.js 13 App Router)

## 📑 目次

1. [プロジェクト概要](#プロジェクト概要)
2. [環境構築手順](#環境構築手順)
3. [技術的な工夫点](#技術的な工夫点)
4. [追加機能と選定理由](#追加機能と選定理由)
5. [生成 AI 利用レポート](#生成-ai-利用レポート)

---

## プロジェクト概要

店舗の **モバイルオーダー & 管理ダッシュボード** を Next.js 13（App Router）でフルスタック実装しています。

- **顧客**: メニュー閲覧 → カート → 決済 → 履歴
- **スタッフ**: オーダー一覧で調理状況を更新
- **管理者**: メニュー CRUD・売上分析・スタッフ管理
- デプロイ: **Vercel** + **Vercel Postgres (Neon)** + Cloudinary

---

## 環境構築手順

### 1. 前提

- Node.js **18+**
- pnpm / npm / yarn いずれか
- Git / GitHub

### 2. リポジトリ取得

```bash
$ git clone https://github.com/your-org/mobile-order.git
$ cd mobile-order
```

### 3. 依存関係 & Prisma

```bash
# 依存インストール
$ npm i

# .env ファイルを作成して環境変数をセット
$ cp .env.example .env.local
```

主要な .env 項目:

| 変数                                        | 説明                          |
| ------------------------------------------- | ----------------------------- |
| `DATABASE_URL`                              | Neon など Postgres 接続文字列 |
| `NEXTAUTH_SECRET` / `NEXTAUTH_URL`          | next‑auth 用                  |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | OAuth                         |
| `CLOUDINARY_*`                              | 画像アップロード              |

```bash
# DB マイグレーション & シード
$ npx prisma migrate deploy
$ npx prisma db seed
```

### 4. 開発サーバー

```bash
$ npm run dev
# http://localhost:3000 で確認
```

### 5. ビルド & 本番実行

```bash
$ npm run build && npm start
```

---

## 技術的な工夫点

| 分類                      | 工夫ポイント                                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| **Next.js 13 App Router** | Server/Client Component 分離で SEO & 体験を最適化。`use client` 指定を最小化しバンドルサイズを削減。              |
| **DB & ORM**              | Neon(Postgres) + Prisma で型安全なクエリ。Decimal → number 変換を共通ヘルパに集約。                               |
| **認証**                  | next‑auth v4: Credentials + Google OAuth。`middleware.ts` で保護ルートを制御。                                    |
| **カート機能**            | `useCart` フックで React Context + localStorage 同期。SSR 水合問題を `mounted` フラグで解消。                     |
| **画像最適化**            | Cloudinary 署名付き URL を Prisma に保存し `<Image>` で自動最適化。                                               |
| **レスポンシブ UI**       | Tailwind CSS。`container mx-auto px‑4` を徹底し 375px でも横スクロール無し。モバイルではハンバーガー + ドロワー。 |
| **CI/CD**                 | GitHub Actions で Lint/Test/Build → Vercel CLI Deploy。キャッシュで高速化。                                       |
| **型安全**                | Prisma 型生成 + `zod` で Server Actions の入力検証。                                                              |
| **Analytics**             | Recharts + Prisma 集計でダッシュボードの売上折れ線 / 円グラフ。                                                   |

---

## 追加機能と選定理由

| 機能                                     | 理由                                                 |
| ---------------------------------------- | ---------------------------------------------------- |
| **スタッフ & 管理者ロール**              | 実運用を想定し、調理オペレーションと経営分析を分離。 |
| **売上ダッシュボード**                   | 日次売上・人気メニュー可視化で経営判断を支援。       |
| **Cloudinary 画像アップロード**          | メニュー画像を直感的に登録でき、CDN 最適化も享受。   |
| **ハンバーガー / ドロワーメニュー**      | モバイル UX 改善。                                   |
| **チャレンジ機能(ゲーミフィケーション)** | リピート率向上を狙った実験的機能。                   |

---

## 生成 AI 利用レポート

### 1. 使用した AI ツール

| ツール               | 用途                                             |
| -------------------- | ------------------------------------------------ |
| **ChatGPT (GPT‑4o)** | コードレビュー・アーキテクチャ相談・正規表現作成 |
| **GitHub Copilot**   | boilerplate 補完・テストスケルトン生成           |
| **Claude 3 Sonnet**  | README や UI 文言の自然な日本語生成              |

### 2. 使用場面と目的

1. **データモデル設計** … ER 図を提示して最適な Prisma Schema を提案してもらった。
2. **Server Action のバリデーション** … `zod` のスキーマ例を生成。
3. **正規表現** … Email/Password の入力チェック。
4. **README テンプレ** … 見出し構成を生成。
5. **デバッグ** … ビルドエラーを StackTrace 付きで投げて解決策を取得。

### 3. 代表的なプロンプト例

```text
// ChatGPT (2024‑05‑10)
次の要件で Prisma schema を書き直して:
- order は orderItem をネスト
- status は Enum("PENDING","COOKING","DONE")
- total は Decimal でスケール2
```

```text
// Copilot コメント
/* 生成 AI 提案
Create a Zod schema that validates tableNumber as `/^[A-Z]\d{1,2}$/`
*/
```

> **備考**: AI 提案コードは必ずローカルで動作確認・セキュリティレビューを行い、最終的なコミットは人間が責任を持って行いました。

---

🚀 **Happy Coding & Bon Appétit!**
