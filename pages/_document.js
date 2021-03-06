import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  const trackCode = process.env.NEXT_PUBLIC_GA_TRACKCODE;
  return (
    <Html>
      <Head>
         <script
            async
            src={`https://www.googletagmanager.com/gtag/js?id=${trackCode}`}
          />
          <script
            dangerouslySetInnerHTML={{
              __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${trackCode}', {
              page_path: window.location.pathname,
            });
          `,
            }}
          />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}