import list from '@techblog/articles/build/list';

export default (path, query) => {
  if (path.startsWith('/articles/')) {
    return article(path);
  }

  switch (path) {
    case '/articles':
      return articles(path, query);
    case '/about':
      return about(path);
    default:
      return home(path);  
  }
};

const SITE_NAME = '横須賀第283管区情報局';

const TYPE_WEBSITE = 'website';
const TYPE_ARTICLE = 'article';

const home = (path) => {
  const prefix = path === '/' ? WELCOME_AA : '';

  return {
    head: prefix + metaTemplate(
      SITE_NAME,
      'Subroh Nishikoriの技術ブログ',
      TYPE_WEBSITE,
      path,
    ),
  };
};

const articles = (path, query) => {
  if (query.tag) {
    return {
      head: metaTemplate(
        `タグ検索: ${query.tag} - ${SITE_NAME}`,
        `${query.tag}タグ付きの全ての記事`,
        TYPE_WEBSITE,
        `${path}?tag=${query.tag}`,
      ),
    }
  }  

  return {
    head: metaTemplate(
      `全ての記事 - ${SITE_NAME}`,
      '全ての記事',
      TYPE_WEBSITE,
      path,
    ),
  };
};

const article = (path) => {
  const title = path.replace('/articles/', '');
  const { displayTitle, description, publishedAt, updatedAt, tags } = findArticle(title) || {};

  if (!displayTitle) {
    return home(path)
  }

  return {
    head: metaTemplate(
      `${displayTitle} - ${SITE_NAME}`,
      description,
      TYPE_ARTICLE,
      path,
      publishedAt,
      updatedAt,
      tags,
    ),
  }
};

const about = (path) => ({
  head: metaTemplate(
    `このサイトについて - ${SITE_NAME}`,
    'このサイトや筆者について',
    TYPE_WEBSITE,
    path,
  ),
});

const findArticle = title => list.find(a => a.title === title);

const metaTemplate = (title, description, type, path, publishedAt = null, updatedAt = null, tags = null) => `
  <title>${title}</title>
  <meta name="description" content="${description}">

  <meta property="og:type" content="${type}">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="https://subroh0508.net${path}">
  <meta property='og:image' content='https://subroh0508.net/icon.webp'/>
  ${type === TYPE_ARTICLE ? articleMetaTemplate(publishedAt, updatedAt, tags) : ''}

  <meta name='twitter:card' content='summary'/>
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:url" content="https://subroh0508.net${path}">
  <meta name='twitter:site' content='@subroh_0508'/>
  <meta name='twitter:creator' content='@subroh_0508'/>
  <meta name='twitter:image' content='https://subroh0508.net/icon.webp'/>

  <meta name='fb:app_id' content='510289996426924'/>
`;

const articleMetaTemplate = (publishedAt, updatedAt, tags) => `
  <meta property="article:published_time" content="${publishedAt}">
  <meta property="article:modified_time" content="${updatedAt}">
  <meta property="article:author" content="subroh_0508">
${tags.map(tag => `  <meta property="article:tag" content="${tag}">`).join('\n')}
`;

const WELCOME_AA = `
<!--
　　　　　　　　　 　 　 　 　 　 ＿＿＿
　　　　　　　　　　　　　, ィ　´: : : : : : : ｀ ｰ=　、
　　　　　 　 　 　 　 ,ィ´: : : : : : : : : : : : : : : : : :｀ヽ、
　　 　 　 　 　 　 ,ノ: : : : : : : :、: : : : : : : : : : : : : : :ヽ、
　　 　 　 　 　 /´: : : : : : : : : :〉､ヽ、: :ヽ、: :ヽ: : : : : :丶
　　　　 　 　 / : : : : : : : /　 /　 ヾ、｀ヽﾞ ､ヽ }ゝ: : : : : :ヽ
　　 　 　 　 / : : : : : : : :{　,ﾉ　　＿ ｀　 \`ﾞ　ヽi　ヽ }: :ヽ: トヽ
　　　　　　/ : : : : : : : ゛ {/ , -' ´　　　　　 　 '⌒ヽ}'ｉ ; ﾞi }　 \`
　　 　 　 / : : : : : : : 、゛{ 　 ,,ィ＝ｰ　　　　　 ｨ=ヽ　ﾚ} }/
　　　　 ノ,、: : : : : : : }: : ﾞ　《 （ し}　　　　 　 {Ｊ} .） //′
　　 　 '´´ {: : : : : : : :.}: : ﾞ、 \` \`ｰ′　 　 　 ､\`" '　; (
　　　　　 ハ: : : : : :.ｆ´ｌ : : \`ヽ､〃〃　 　 　 ´〃〃ｌ :\`ｰ 、
　　　　　 　 ヾヾ､: :弋ﾞ{: : : : : :ヽ　　 　 　 　 　 　 ｊ､ : : ｆ′
　　　　　　　　｀\` ｀ヾ､ﾞヽ=ヽ : : ,'　　　　 つ　 　 ,ｲ { : : ﾞ 、
　　　　　　　　　　　　 ヾ}ﾞY: : : :ト　、　　　　 ／　　 ｀ヾ:i´｀
　　　　 　 　 　 　 　 　 　 ｀\`７ ;-\`　　＞ｰ '′　　　　 ﾚ′
　　　　　　　　　　　　　　　　　r'ー- ､、　ト‐r 、
　　　　　　　　 　 　 　 　 , ィ´｀ヽ,、＿>ヽ}'ｰ(/､-=、_
　　　　　　　　　 　 ,　ィ ´ヽ＝＝}　＼=ゝ､(二)､｀ヽ--｀ニ\`ヽ
　　　　　 　 　 　 /'´￣ ヽ　　　/、　　＼、 「　　｀)ヽ、 ﾞ　∧} 、
　　　　　　　　　 ,'　　　　 ヽ　 ＾ヾ、　　　＼ヽ\`ヽ>'\`ヽ.ヽ゛　.ヽ ヽ
　　　　　　 　 　 {　　　　　　ヽ 　 , ｀ヾ 、　 ヽ､｀ヽ、　 \`i∨ﾞ　 ヽヽ
　　　 　 　 　 　 ｌ　　　　　　　ヽ. ;　　 　ﾞヾ、　ヽ､:｡｀ヽ、}ﾟヽﾞ　　ヽヽ
　　　 　 　 　 　 |　　 　 　 　 　 Y/:::: 　 　 ｀ヾ、 ヽ:｡ﾟ:｡ﾟﾞ、Oﾞ､　 ∧ﾍ
.　　　　　　　 　 {　　　　　　　　 ;'::::::　　　　 　 ＼ .ヽ:｡ﾟ:｡ﾞ､:｡ﾟ∨.　 i .ﾍ
　　　　　　　　　ｊ　　　　 ﾞ、　　 ,':::::::　　　　　　　 ヾ ヽ｡ﾟ:｡ﾞ､:｡ﾟ∨　ﾞi　ヾ、
　　　　 　 　 　 {i 　 　 　 ﾞ,　　 ;::::::::: 　　　　　　　　ヾ.ヽ:｡ﾟ:｡ﾟ:｡ﾟ:ﾞ゛　ﾞ,　 丶
.　　　　　 　 　 ｌ i　　　　　ﾞ. 　,':::::::::::...　 　 　 　 　 　 ヾﾞ､ﾟ:｡ﾟ:､:｡ﾟi　 .ﾞ　　 ヽ
　　　　　 　 　 {. ゛ 　 　 　 ∨,' ヽ::::::::::... 　　　　　　　　 ヾ:｡ﾟ:｡i｡0ﾞ,゛, ﾞ.　 　 ゝ,、
　　　　　 　 　 ｌ　　　　　　　Y 　 ＼::::::::::.　　　　　　 　 O ﾞ､｡ﾟﾞ:｡ﾟ:｡} ヽﾞ,　　::冫｀ｰ　、
　　 　 　 　 　 {　　　　　　　 ∨　　 ヽ、:: 　　　　　　　　　 ﾞi:｡ﾟ:}｡ﾟ:｡{ i ヾ　::::/、　　　 ｀＞　 、　　　　　　　　　　　　　　,　＿　 , 、
　　 　 　 　 　 | 　 　 　 　 　 /　　　　 〉　　　　　　 　 ::　　 }:｡ﾟ:i:｡ﾟ:｡ヾ ､ﾞ､:::::::}　　　　　　　　　｀＞　 、　 　 　 　 　 ／ィ´ニﾆ彡′
　　 　 　 　 　 |　　 　 ,　- '⌒ヽ　　 　 ヽ:　 　 　 ....:::　　 　 }:｡ﾟ}:｡ﾟO:｡ﾟヽ ヽ、::::.......... 　 　 　 　 　 　 　 ｀ ー=、 , ィ´　／,ィ´>
　　 　 　 　 　 |　　　　　　　　　｀ヽ 、 ./::::::::::::::::::::　　 　 　 i:｡ﾟ:{:｡ﾟ:｡ﾟ:｡ﾟ:ヽ,/ヽ\`ｰ :::､_::::::::::::::::::::..........................;　} 　 　 ｀´彡'´
　　 　 　 　 　 { 　 　 　 　 　 　 　 　 ＞　、:::::::　　　　　　　ｊ:｡ﾟ:,!:､:｡ﾟ:｡ﾟ:｡ﾍ//ヾ、　　 ｀\` 　ヽ、::::::::::::::::::::::::,' ,'、　　,　'´
　　 　 　 　 　 ﾞ　、:::::......　　　　　　　　　　　\`　ー-　、　O ,',､'　 }｀iヽｲヽ ヽ//ヾ 、　 　 　 　 ｀　ー-　 ､_,'-'　｀＝
　 　 　 　 　 　 　 \`＜、:::::::::::........　　　　　　　　　,r'´7-‐' ´　 二ニ⊃、 ﾞ、∨//ヾヽ
　　　　　　　　　　　　　\`　＜:::::::::::::::::::::::::::............;'　/　　 　 ＜ゝ 、 、 ﾊ、ﾞ､.ﾊ////ヾヽ、
　　　　　　　　 　 　 　 　 　 　 >-:::、::::::::::::::::::::::{　{‐.,-＝ 、　 ∨i　ﾞ ﾞ、ﾊ',ゝ、ヽ,////ヽヾ、、
　　　　　　　 　 　 　 　 　 　 /:::::::: 　 \`　＜　　 ト､_}/　 /｀ｰ､_ラゝ';､ﾞ､ﾞ }U　 !、ﾞｖ/////ヽヾ)
　　　　　　　　　　　　 　 　 /::::::　 　 　 　 　 \`ー'′_.　/ー- ＝ ,ィ 'U'uUﾞ′　ヽ　ヽ,/////ヽヽ

　　　  　    ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
　　　　      ┃『ようこそお越しくださいました。このブログに書きためた知見が、みなさんのお役に立てれば幸いです。』 ┃
　　　　      ┃…噛まずに言えた、よくやったぞ、瑞希…😊                                           ┃
　　　　      ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛
-->
`;
