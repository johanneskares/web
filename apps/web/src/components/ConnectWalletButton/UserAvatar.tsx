import { useAccount, useEnsAvatar, useEnsName } from 'wagmi';
import Image from 'next/image';
import { mainnet } from 'wagmi/chains';
import { getUserNamePicture } from 'apps/web/src/utils/usernames';
import classNames from 'classnames';
import { useCallback, useState } from 'react';

export enum AvatarSizes {
  Medium,
  None,
}

type UserAvatarProps = { size?: AvatarSizes };

export function UserAvatar({ size = AvatarSizes.None }: UserAvatarProps) {
  const { address } = useAccount();
  const [avatarImageIsLoading, setAvatarImageIsLoading] = useState<boolean>(true);
  const { data: ensName, isLoading: ensNameIsLoading } = useEnsName({
    address,
    chainId: mainnet.id,
  });
  const { data: ensAvatar, isLoading: ensAvatarIsLoading } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: mainnet.id,
    assetGatewayUrls: {
      ipfs: 'https://cloudflare-ipfs.com',
    },
  });

  const onLoadAvatar = useCallback(() => {
    setAvatarImageIsLoading(false);
  }, []);

  // TODO: Resolve address to [name].base.eth when the reverse resolver is setup
  const deterministicName = address ?? 'default-avatar';
  const defaultSelectedProfilePicture = getUserNamePicture(deterministicName);
  const avatar = ensAvatar ?? defaultSelectedProfilePicture;

  const isLoading = ensNameIsLoading || ensAvatarIsLoading || avatarImageIsLoading;

  const figureClasses = classNames('bg-blue-500', {
    'h-[2rem] max-h-[2rem] min-h-[2rem] w-[2rem] min-w-[2rem] max-w-[2rem] rounded-full overflow-hidden':
      size === AvatarSizes.Medium,
    'animate-pulse': isLoading,
  });

  const avatarClasses = classNames('transition-opacity duration-500 ', {
    'opacity-0': isLoading,
    'opacity-100': !isLoading,
  });

  return (
    <figure className={figureClasses}>
      <Image src={avatar} className={avatarClasses} alt="Avatar" onLoad={onLoadAvatar} />
    </figure>
  );
}
