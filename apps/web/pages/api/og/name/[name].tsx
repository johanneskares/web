import { ImageResponse } from '@vercel/og';
import { formatBaseEthDomain, getUserNamePicture } from 'apps/web/src/utils/usernames';
import { NextRequest } from 'next/server';
import tempPendingAnimation from 'apps/web/src/components/Basenames/tempPendingAnimation.png';
export const config = {
  runtime: 'edge',
};

export default async function handler(request: NextRequest) {
  const url = new URL(request.url);

  const username = url.searchParams.get('name') || 'yourname';
  const formattedName = formatBaseEthDomain(username);

  const fontData = await fetch(
    new URL('../../../../src/fonts/CoinbaseDisplay-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer());

  const profilePicture = getUserNamePicture(username);

  // TODO FIX this
  const domainName = 'http://localhost:3000';
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${domainName + tempPendingAnimation.src})`,
          backgroundPosition: 'center',
          backgroundSize: '100% 100%',
          padding: '1.5rem',
        }}
      >
        <div tw="bg-gray-50 flex">
          <div
            style={{
              display: 'flex',
              gap: '1rem',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#0455FF',
              borderRadius: '5rem',
              padding: '1rem',
              paddingRight: '1.5rem',
              fontSize: '5rem',

              maxWidth: '100%',
              boxShadow:
                '0px 8px 16px 0px rgba(0,82,255,0.32),inset 0px 8px 16px 0px rgba(255,255,255,0.25) ',
            }}
          >
            <figure style={{ borderRadius: '100%', overflow: 'hidden' }}>
              <img src={domainName + profilePicture.src} height={80} width={80} />
            </figure>
            <span
              style={{
                color: 'white',
                paddingBottom: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: 'auto',
              }}
            >
              {formattedName}
            </span>
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: 'Typewriter',
          data: fontData,
          style: 'normal',
        },
      ],
    },
  );
}
