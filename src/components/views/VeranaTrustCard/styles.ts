import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {fontStyle} from '../../../styles/typography';

export const veranaCardColors = {
  surface: '#2C334B',
  chip: '#3B425E',
  border: '#404D7A',
  heading: '#FBFBFB',
  body: '#FBFBFB',
  sub: '#8D9099',
  link: '#7276F7',
  positive: '#00C249',
  positiveText: '#B1EBC9',
  positiveSoft: '#00C2491F',
  positiveRail: '#00C24966',
  warning: '#FF9900',
  danger: '#D74500',
  dangerText: '#E7C9BB',
  dangerSoft: '#D745001F',
  dangerRail: '#D7450066',
  neutral: '#8D9099',
  neutralSoft: '#8D90991F',
  neutralRail: '#8D909966',
  onTint: '#FBFBFB',
};

export const TickCircleStyled = styled(View)<{circleColor: string}>`
  width: 28px;
  height: 28px;
  border-radius: 14px;
  align-items: center;
  justify-content: center;
  background-color: ${({circleColor}) => circleColor};
`;

export const TickQueryTextStyled = styled(Text)`
  font-family: Poppins-SemiBold;
  font-size: 15px;
  font-weight: 800;
  color: ${veranaCardColors.onTint};
`;

export const VerdictPillStackStyled = styled(View)`
  gap: 8px;
`;

export const VerdictPillRowStyled = styled(View)<{pillBorderColor: string}>`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  align-self: flex-start;
  border-width: 2px;
  border-color: ${({pillBorderColor}) => pillBorderColor};
  border-radius: 14px;
  padding: 8px 14px;
  background-color: ${veranaCardColors.surface};
`;

export const VerdictPillLabelTextStyled = styled(Text)<{labelColor: string}>`
  font-family: ${fontStyle.h3SemiBold.fontFamily};
  font-size: ${fontStyle.h3SemiBold.fontSize}px;
  font-weight: ${fontStyle.h3SemiBold.fontWeight};
  line-height: ${fontStyle.h3SemiBold.lineHeight}px;
  letter-spacing: 0.6px;
  color: ${({labelColor}) => labelColor};
`;

export const VerdictPillNoteTextStyled = styled(Text)<{noteColor: string}>`
  font-family: ${fontStyle.h4Regular.fontFamily};
  font-size: ${fontStyle.h4Regular.fontSize}px;
  font-weight: ${fontStyle.h4Regular.fontWeight};
  line-height: ${fontStyle.h4Regular.lineHeight}px;
  color: ${({noteColor}) => noteColor};
`;

export const RegistryChipContainerStyled = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  align-self: flex-start;
  background-color: ${veranaCardColors.chip};
  border-radius: 8px;
  padding: 4px 8px;
`;

export const RegistryChipLabelTextStyled = styled(Text)`
  font-family: ${fontStyle.h5SemiBold.fontFamily};
  font-size: ${fontStyle.h5SemiBold.fontSize}px;
  font-weight: 700;
  line-height: ${fontStyle.h5SemiBold.lineHeight}px;
  color: ${veranaCardColors.sub};
`;

export const RegistryChipValueTextStyled = styled(Text)`
  font-family: ${fontStyle.h4SemiBold.fontFamily};
  font-size: ${fontStyle.h4SemiBold.fontSize}px;
  font-weight: 600;
  line-height: ${fontStyle.h4SemiBold.lineHeight}px;
  color: ${veranaCardColors.heading};
`;

export const ConditionRowStyled = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const ConditionLinkTextStyled = styled(Text)`
  font-family: ${fontStyle.h3SemiBold.fontFamily};
  font-size: ${fontStyle.h3SemiBold.fontSize}px;
  font-weight: 600;
  line-height: ${fontStyle.h3SemiBold.lineHeight}px;
  color: ${veranaCardColors.link};
  flex-shrink: 1;
`;

export const ConditionStateRowStyled = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 4px;
  margin-left: auto;
`;

export const ConditionIntactTextStyled = styled(Text)`
  font-family: ${fontStyle.h5SemiBold.fontFamily};
  font-size: ${fontStyle.h5SemiBold.fontSize}px;
  font-weight: 700;
  line-height: ${fontStyle.h5SemiBold.lineHeight}px;
  color: ${veranaCardColors.positiveText};
`;

export const ConditionNoDigestTextStyled = styled(Text)`
  font-family: ${fontStyle.h4Regular.fontFamily};
  font-size: ${fontStyle.h4Regular.fontSize}px;
  font-weight: ${fontStyle.h4Regular.fontWeight};
  line-height: ${fontStyle.h4Regular.lineHeight}px;
  color: ${veranaCardColors.sub};
  margin-left: auto;
`;

export const ExplorerLinkRowStyled = styled(TouchableOpacity)`
  flex-direction: row;
  align-items: center;
  gap: 6px;
`;

export const ExplorerLinkTextStyled = styled(Text)`
  font-family: ${fontStyle.h3SemiBold.fontFamily};
  font-size: ${fontStyle.h3SemiBold.fontSize}px;
  font-weight: 600;
  line-height: ${fontStyle.h3SemiBold.lineHeight}px;
  color: ${veranaCardColors.link};
`;

export const LogoBadgeContainerStyled = styled(View)`
  width: 40px;
  height: 40px;
`;

export const LogoBadgeBubbleStyled = styled(View)`
  position: absolute;
  right: -4px;
  bottom: -4px;
  width: 16px;
  height: 16px;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  background-color: ${veranaCardColors.surface};
`;

export const DidRowStyled = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const DidDotStyled = styled(View)<{dotColor: string}>`
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background-color: ${({dotColor}) => dotColor};
`;

export const DidTextStyled = styled(Text)`
  font-family: ${fontStyle.h4Regular.fontFamily};
  font-size: ${fontStyle.h4Regular.fontSize}px;
  font-weight: ${fontStyle.h4Regular.fontWeight};
  line-height: ${fontStyle.h4Regular.lineHeight}px;
  color: ${veranaCardColors.sub};
  flex-shrink: 1;
`;

export const TestnetChipStyled = styled(View)`
  border-width: 1.5px;
  border-color: ${veranaCardColors.warning};
  border-radius: 6px;
  padding: 1px 5px;
`;

export const TestnetChipTextStyled = styled(Text)`
  font-family: ${fontStyle.h5SemiBold.fontFamily};
  font-size: ${fontStyle.h5SemiBold.fontSize}px;
  font-weight: 800;
  line-height: ${fontStyle.h5SemiBold.lineHeight}px;
  letter-spacing: 0.8px;
  color: ${veranaCardColors.warning};
`;

export const SectionLabelTextStyled = styled(Text)`
  font-family: ${fontStyle.h5SemiBold.fontFamily};
  font-size: ${fontStyle.h5SemiBold.fontSize}px;
  font-weight: 700;
  line-height: ${fontStyle.h5SemiBold.lineHeight}px;
  letter-spacing: 0.8px;
  color: ${veranaCardColors.sub};
`;

export const IdentityHeadingRowStyled = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
`;

export const IdentityHeadingTextStyled = styled(Text)`
  font-family: ${fontStyle.h2SemiBold.fontFamily};
  font-size: ${fontStyle.h2SemiBold.fontSize}px;
  font-weight: ${fontStyle.h2SemiBold.fontWeight};
  line-height: ${fontStyle.h2SemiBold.lineHeight}px;
  color: ${veranaCardColors.heading};
  flex-shrink: 1;
`;

export const FlagCodeTextStyled = styled(Text)`
  font-family: ${fontStyle.h5SemiBold.fontFamily};
  font-size: ${fontStyle.h5SemiBold.fontSize}px;
  font-weight: 700;
  line-height: ${fontStyle.h5SemiBold.lineHeight}px;
  color: ${veranaCardColors.sub};
`;
