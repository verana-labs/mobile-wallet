import React, {FC, ReactElement} from 'react';
import {Linking} from 'react-native';
import Svg, {Circle, Path, Rect, Text as SvgText} from 'react-native-svg';
import type {EcsAssetRef} from '../../../services/veranaEcs';
import type {VeranaTrustStatus} from '../../../services/veranaTrustService';
import {
  ConditionIntactTextStyled,
  ConditionLinkTextStyled,
  ConditionNoDigestTextStyled,
  ConditionRowStyled,
  ConditionStateRowStyled,
  DidDotStyled,
  DidRowStyled,
  DidTextStyled,
  ExplorerLinkRowStyled,
  ExplorerLinkTextStyled,
  FlagCodeTextStyled,
  IdentityHeadingRowStyled,
  IdentityHeadingTextStyled,
  LogoBadgeBubbleStyled,
  LogoBadgeContainerStyled,
  RegistryChipContainerStyled,
  RegistryChipLabelTextStyled,
  RegistryChipValueTextStyled,
  SectionLabelTextStyled,
  TestnetChipStyled,
  TestnetChipTextStyled,
  TickCircleStyled,
  TickQueryTextStyled,
  veranaCardColors,
  VerdictPillLabelTextStyled,
  VerdictPillNoteTextStyled,
  VerdictPillRowStyled,
  VerdictPillStackStyled,
} from './styles';

export const VERANA_EXPLORER = 'https://app.testnet.verana.network';

export const VERDICT_TONE: Record<VeranaTrustStatus, {color: string; text: string; label: string}> = {
  TRUSTED: {color: veranaCardColors.positive, text: veranaCardColors.positiveText, label: 'TRUSTED'},
  PARTIAL: {color: veranaCardColors.warning, text: veranaCardColors.warning, label: 'PARTIAL'},
  UNTRUSTED: {color: veranaCardColors.danger, text: veranaCardColors.dangerText, label: 'UNTRUSTED'},
  UNVERIFIED: {color: veranaCardColors.neutral, text: veranaCardColors.neutral, label: 'COULD NOT VERIFY'},
};

type IconProps = {color: string; size?: number};

export const CheckIcon: FC<IconProps> = ({color, size = 15}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="m5 12 5 5L20 7" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const CrossIcon: FC<IconProps> = ({color, size = 15}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M18 6 6 18M6 6l12 12" stroke={color} strokeWidth={3} strokeLinecap="round" fill="none" />
  </Svg>
);

export const InfoIcon: FC<IconProps> = ({color, size = 15}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Circle cx={12} cy={12} r={9} stroke={color} strokeWidth={1.8} fill="none" />
    <Path d="M12 11v5" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
    <Circle cx={12} cy={7.6} r={1.1} fill={color} />
  </Svg>
);

const LockIcon: FC<IconProps> = ({color, size = 14}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Rect x={5} y={11} width={14} height={9} rx={2} stroke={color} strokeWidth={1.8} fill="none" />
    <Path d="M8 11V7a4 4 0 0 1 8 0v4" stroke={color} strokeWidth={1.8} strokeLinecap="round" fill="none" />
  </Svg>
);

const ArrowUpRightIcon: FC<IconProps> = ({color, size = 13}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24">
    <Path d="M7 17 17 7M9 7h8v8" stroke={color} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" fill="none" />
  </Svg>
);

export const VeranaMark: FC<{size?: number}> = ({size = 16}) => (
  <Svg width={size} height={size} viewBox="0 0 64 64">
    <Rect width={64} height={64} rx={12} fill="#763EF0" />
    <Path d="M46.3 22.8 32 50.4 17.7 22.8l1.9-3.4 2 3.5L32 43.4l10.4-20.5 2 -3.5 1.9 3.4Z" fill="#ffffff" />
    <Path d="M22.4 15.8 32 34.2l9.3-18.4H22.4Z" fill="#ffffff" />
  </Svg>
);

const EU_STAR_POSITIONS = Array.from({length: 12}, (_, index) => {
  const angle = (index * Math.PI) / 6;
  return {cx: 10 + 6 * Math.sin(angle), cy: 10 - 6 * Math.cos(angle)};
});

const FLAG_ART: Record<string, ReactElement> = {
  CH: (
    <>
      <Rect width={20} height={20} rx={3} fill="#DA291C" />
      <Path d="M8.6 4h2.8v4.6H16v2.8h-4.6V16H8.6v-4.6H4V8.6h4.6z" fill="#ffffff" />
    </>
  ),
  KY: (
    <>
      <Rect width={20} height={20} rx={3} fill="#00247D" />
      <Path d="M0 0h10v7H0z" fill="#012169" />
      <Path d="M0 0l10 7M10 0L0 7" stroke="#ffffff" strokeWidth={1.4} fill="none" />
      <Path d="M5 0v7M0 3.5h10" stroke="#ffffff" strokeWidth={2.2} fill="none" />
      <Path d="M5 0v7M0 3.5h10" stroke="#C8102E" strokeWidth={1.2} fill="none" />
    </>
  ),
  FR: (
    <>
      <Rect width={20} height={20} rx={3} fill="#ffffff" />
      <Path d="M0 3a3 3 0 0 1 3-3h3.7v20H3a3 3 0 0 1-3-3z" fill="#002395" />
      <Path d="M13.3 0H17a3 3 0 0 1 3 3v14a3 3 0 0 1-3 3h-3.7z" fill="#ED2939" />
    </>
  ),
  ES: (
    <>
      <Rect width={20} height={20} rx={3} fill="#F1BF00" />
      <Path d="M0 5V3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v2z" fill="#AA151B" />
      <Path d="M0 15h20v2a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z" fill="#AA151B" />
    </>
  ),
  SE: (
    <>
      <Rect width={20} height={20} rx={3} fill="#006AA7" />
      <Path d="M6 0h4v20H6z" fill="#FECC02" />
      <Path d="M0 8h20v4H0z" fill="#FECC02" />
    </>
  ),
  DE: (
    <>
      <Rect width={20} height={20} rx={3} fill="#DD0000" />
      <Path d="M0 6.7V3a3 3 0 0 1 3-3h14a3 3 0 0 1 3 3v3.7z" fill="#000000" />
      <Path d="M0 13.3h20V17a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3z" fill="#FFCE00" />
    </>
  ),
  EU: (
    <>
      <Rect width={20} height={20} rx={3} fill="#003399" />
      {EU_STAR_POSITIONS.map(star => (
        <Circle key={`${star.cx}-${star.cy}`} cx={star.cx} cy={star.cy} r={1.1} fill="#FFCC00" />
      ))}
    </>
  ),
};

// Drawn, never emoji: regional-indicator pairs fall back inconsistently across Android builds; undrawn countries degrade to the ISO code.
export const CountryFlag: FC<{code?: string; size?: number}> = ({code, size = 16}) => {
  if (!code) {
    return null;
  }
  const key = code.toUpperCase();
  const art = FLAG_ART[key];
  if (!art) {
    return <FlagCodeTextStyled>{key}</FlagCodeTextStyled>;
  }
  return (
    <Svg width={size} height={size} viewBox="0 0 20 20">
      {art}
    </Svg>
  );
};

export type StepTone = 'ok' | 'bad' | 'none';

export const StepTick: FC<{tone: StepTone}> = ({tone}) => (
  <TickCircleStyled circleColor={tone === 'ok' ? veranaCardColors.positive : tone === 'bad' ? veranaCardColors.danger : veranaCardColors.neutral}>
    {tone === 'ok' ? (
      <CheckIcon color={veranaCardColors.onTint} size={15} />
    ) : tone === 'bad' ? (
      <CrossIcon color={veranaCardColors.onTint} size={15} />
    ) : (
      <TickQueryTextStyled>?</TickQueryTextStyled>
    )}
  </TickCircleStyled>
);

export const VerdictPill: FC<{verdict: VeranaTrustStatus; note?: string}> = ({verdict, note}) => {
  const tone = VERDICT_TONE[verdict];
  return (
    <VerdictPillStackStyled>
      <VerdictPillRowStyled pillBorderColor={tone.color}>
        <VeranaMark />
        <VerdictPillLabelTextStyled labelColor={tone.text}>{tone.label}</VerdictPillLabelTextStyled>
      </VerdictPillRowStyled>
      {note ? (
        <VerdictPillNoteTextStyled noteColor={verdict === 'TRUSTED' || verdict === 'UNVERIFIED' ? veranaCardColors.sub : veranaCardColors.dangerText}>
          {note}
        </VerdictPillNoteTextStyled>
      ) : null}
    </VerdictPillStackStyled>
  );
};

export const RegistryChip: FC<{label: string; value?: string}> = ({label, value}) => {
  if (!value) {
    return null;
  }
  return (
    <RegistryChipContainerStyled>
      <RegistryChipLabelTextStyled>{label}</RegistryChipLabelTextStyled>
      <RegistryChipValueTextStyled>{value}</RegistryChipValueTextStyled>
    </RegistryChipContainerStyled>
  );
};

const isHttpUri = (uri: string): boolean => /^https?:\/\//i.test(uri);

export const ConditionRow: FC<{asset?: EcsAssetRef; label: string}> = ({asset, label}) => {
  if (!asset || !isHttpUri(asset.uri)) {
    return null;
  }
  return (
    <ConditionRowStyled accessibilityRole="link" onPress={() => void Linking.openURL(asset.uri)}>
      <LockIcon color={veranaCardColors.link} size={14} />
      <ConditionLinkTextStyled numberOfLines={1}>{label}</ConditionLinkTextStyled>
      {asset.digest ? (
        <ConditionStateRowStyled>
          <CheckIcon color={veranaCardColors.positiveText} size={12} />
          <ConditionIntactTextStyled>intact</ConditionIntactTextStyled>
        </ConditionStateRowStyled>
      ) : (
        <ConditionNoDigestTextStyled>no digest</ConditionNoDigestTextStyled>
      )}
    </ConditionRowStyled>
  );
};

export const ExplorerLink: FC<{did: string}> = ({did}) => (
  <ExplorerLinkRowStyled accessibilityRole="link" onPress={() => void Linking.openURL(`${VERANA_EXPLORER}/did/${encodeURIComponent(did)}`)}>
    <ExplorerLinkTextStyled>Open this DID in Verana</ExplorerLinkTextStyled>
    <ArrowUpRightIcon color={veranaCardColors.link} size={13} />
  </ExplorerLinkRowStyled>
);

const LOGO_TINTS = ['#0f9488', '#1d4ed8', '#9a3412', '#3f3f46'] as const;

const initialsOf = (name?: string): string =>
  (name ?? '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(word => word[0]?.toUpperCase() ?? '')
    .join('') || '?';

export const LogoBadge: FC<{name?: string; verified?: boolean}> = ({name, verified}) => {
  const initials = initialsOf(name);
  const tint = LOGO_TINTS[initials.charCodeAt(0) % LOGO_TINTS.length];
  return (
    <LogoBadgeContainerStyled>
      <Svg width={40} height={40} viewBox="0 0 40 40">
        <Rect width={40} height={40} rx={11} fill={tint} />
        <SvgText x={20} y={26} fontSize={initials.length > 1 ? 14 : 17} fontWeight="bold" fill="#ffffff" textAnchor="middle">
          {initials}
        </SvgText>
      </Svg>
      {verified ? (
        <LogoBadgeBubbleStyled>
          <CheckIcon color={veranaCardColors.positive} size={11} />
        </LogoBadgeBubbleStyled>
      ) : null}
    </LogoBadgeContainerStyled>
  );
};

export const DidRow: FC<{did: string; verdict: VeranaTrustStatus; testnet?: boolean}> = ({did, verdict, testnet}) => (
  <DidRowStyled>
    <DidDotStyled dotColor={VERDICT_TONE[verdict].color} />
    <DidTextStyled numberOfLines={1}>{did}</DidTextStyled>
    {testnet ? (
      <TestnetChipStyled>
        <TestnetChipTextStyled>TESTNET</TestnetChipTextStyled>
      </TestnetChipStyled>
    ) : null}
    <VeranaMark size={19} />
  </DidRowStyled>
);

export const SectionLabel: FC<{children: string}> = ({children}) => <SectionLabelTextStyled>{children.toUpperCase()}</SectionLabelTextStyled>;

export const IdentityHeading: FC<{name?: string; countryCode?: string}> = ({name, countryCode}) => (
  <IdentityHeadingRowStyled>
    <IdentityHeadingTextStyled>{name ?? 'Not presented'}</IdentityHeadingTextStyled>
    <CountryFlag code={countryCode} />
  </IdentityHeadingRowStyled>
);
