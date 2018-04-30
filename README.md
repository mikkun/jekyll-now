mikkun.github.io
================

[Jekyll Now](https://github.com/barryclark/jekyll-now)をフォーク・カスタマイズして作ったブログ

簡単な説明
----------

わずか数分でブログが作れることをキャッチフレーズにしている[Jekyll Now](https://github.com/barryclark/jekyll-now)ですが、デフォルトでは最小限の機能しか用意されていないため

1. Twitterのシェアボタン
2. ページ切り替え機能
3. アーカイブページ

を追加して使っています([カスタマイズ例](http://mikkun.github.io/))。

カスタマイズ
------------

先述した機能を追加するため、次のようにカスタマイズしています。

1. Twitterのシェアボタン([変更箇所](https://github.com/mikkun/mikkun.github.io/commit/6d1c82cba5ecea0ec31366693fff1aeec816a856)):
    * カスタマイズ内容:
        1. [Twitter Cards](https://developer.twitter.com/en/docs/tweets/optimize-with-cards/overview/abouts-cards)を導入
        2. [Tweet Web Intent](https://dev.twitter.com/web/tweet-button/web-intent)を導入
        3. [Social Buttons for Bootstrap](http://lipis.github.io/bootstrap-social/)を導入
2. ページ切り替え機能([変更箇所](https://github.com/mikkun/mikkun.github.io/commit/da69c307f7d61dcb63ebd4afbf24862a14c7b06a)):
    * カスタマイズ内容:
        1. [Jekyll::Paginate](https://github.com/jekyll/jekyll-paginate)を導入
        2. [Jekyll公式サイトの「Pagination」](https://jekyllrb.com/docs/pagination/)を参考に`index.html`を編集
3. アーカイブページ([変更箇所](https://github.com/mikkun/mikkun.github.io/commit/cbb01b4d69bf035de0e71eb8686649a378df66f7)):
    * カスタマイズ内容:
        1. アーカイブ一覧リンクを生成する`archive.md`を作成
        2. `_layouts/default.html`にアーカイブページへのリンクを作成

上流リポジトリへの追従
----------------------

[フォーク元](https://github.com/barryclark/jekyll-now)に更新があった場合は、次のように作業します。

``` shellsession
# 0. upstreamという名前で上流リポジトリを設定(初回作業時のみ)
$ git remote add upstream https://github.com/barryclark/jekyll-now.git
$ git remote -v
origin  git@github.com:yourusername/yourusername.github.io.git (fetch)
origin  git@github.com:yourusername/yourusername.github.io.git (push)
upstream        https://github.com/barryclark/jekyll-now.git (fetch)
upstream        https://github.com/barryclark/jekyll-now.git (push)

# 1. 上流リポジトリの変更を取得し、自分のmasterにマージ
$ git fetch upstream
$ git merge upstream/master

# 2. 自分のリポジトリを更新
$ git push origin master
```

その他参考リンク
----------------

* [Jekyll Now – Create a Jekyll Blog in minutes](https://www.jekyllnow.com/)
* [Jekyll • Simple, blog-aware, static sites](https://jekyllrb.com/)
* [Liquid template language](https://shopify.github.io/liquid/)
* [Mastering Markdown · GitHub Guides](https://guides.github.com/features/mastering-markdown/)
