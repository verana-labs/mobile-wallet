import {Text, TouchableOpacity, View} from 'react-native';
import styled from 'styled-components/native';
import {fontStyle} from '../../../styles/typography';
import {veranaCardColors} from '../VeranaTrustCard/styles';

export const ChainStackStyled = styled(View)`
  gap: 16px;
`;

export const ChainStepsStyled = styled(View)``;

export const StepRowStyled = styled(View)`
  flex-direction: row;
  gap: 10px;
`;

export const StepRailColumnStyled = styled(View)`
  width: 28px;
  align-items: center;
`;

export const StepRailStyled = styled(View)<{railColor: string}>`
  flex: 1;
  width: 2px;
  min-height: 16px;
  border-radius: 1px;
  background-color: ${({railColor}) => railColor};
`;

export const StepBodyStyled = styled(View)<{isLast?: boolean}>`
  flex: 1;
  gap: 4px;
  padding-bottom: ${({isLast}) => (isLast ? 0 : 14)}px;
`;

export const StepIdentityRowStyled = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  gap: 12px;
`;

export const StepTextColumnStyled = styled(View)`
  flex: 1;
  gap: 6px;
`;

export const ChipsRowStyled = styled(View)`
  flex-direction: row;
  flex-wrap: wrap;
  gap: 8px;
`;

export const BodyTextStyled = styled(Text)`
  font-family: ${fontStyle.h3Regular.fontFamily};
  font-size: ${fontStyle.h3Regular.fontSize}px;
  font-weight: ${fontStyle.h3Regular.fontWeight};
  line-height: ${fontStyle.h3Regular.lineHeight}px;
  color: ${veranaCardColors.body};
  flex-shrink: 1;
`;

export const SubTextStyled = styled(Text)`
  font-family: ${fontStyle.h4Regular.fontFamily};
  font-size: ${fontStyle.h4Regular.fontSize}px;
  font-weight: ${fontStyle.h4Regular.fontWeight};
  line-height: ${fontStyle.h4Regular.lineHeight}px;
  color: ${veranaCardColors.sub};
  flex-shrink: 1;
`;

export const FailureTextStyled = styled(Text)<{failureColor: string}>`
  font-family: ${fontStyle.h3SemiBold.fontFamily};
  font-size: ${fontStyle.h3SemiBold.fontSize}px;
  font-weight: 600;
  line-height: ${fontStyle.h3SemiBold.lineHeight}px;
  color: ${({failureColor}) => failureColor};
`;

export const LoadingTextStyled = styled(Text)`
  font-family: ${fontStyle.h4Regular.fontFamily};
  font-size: ${fontStyle.h4Regular.fontSize}px;
  font-weight: ${fontStyle.h4Regular.fontWeight};
  line-height: ${fontStyle.h4Regular.lineHeight}px;
  color: ${veranaCardColors.sub};
`;

export const AskContainerStyled = styled(View)<{askBorderColor: string; askBackgroundColor: string}>`
  gap: 8px;
  border-radius: 14px;
  padding: 14px;
  border-width: 1.5px;
  border-color: ${({askBorderColor}) => askBorderColor};
  background-color: ${({askBackgroundColor}) => askBackgroundColor};
`;

export const AskCredentialTextStyled = styled(Text)`
  font-family: ${fontStyle.h3SemiBold.fontFamily};
  font-size: ${fontStyle.h3SemiBold.fontSize}px;
  font-weight: 800;
  line-height: ${fontStyle.h3SemiBold.lineHeight}px;
  color: ${veranaCardColors.heading};
`;

export const AskLineStyled = styled(View)`
  flex-direction: row;
  align-items: flex-start;
  gap: 8px;
`;

export const ConditionsContainerStyled = styled(View)`
  gap: 10px;
  background-color: ${veranaCardColors.chip};
  border-radius: 12px;
  padding: 14px;
`;

export const AgeRowStyled = styled(View)`
  flex-direction: row;
  align-items: center;
  gap: 8px;
`;

export const AgeBadgeTextStyled = styled(Text)`
  font-family: ${fontStyle.h3SemiBold.fontFamily};
  font-size: ${fontStyle.h3SemiBold.fontSize}px;
  font-weight: 800;
  line-height: ${fontStyle.h3SemiBold.lineHeight}px;
  color: ${veranaCardColors.warning};
`;

export const RetryButtonStyled = styled(TouchableOpacity)`
  align-self: flex-start;
  border-width: 1.5px;
  border-color: ${veranaCardColors.border};
  border-radius: 14px;
  padding: 8px 14px;
`;

export const RetryButtonTextStyled = styled(Text)`
  font-family: ${fontStyle.h3SemiBold.fontFamily};
  font-size: ${fontStyle.h3SemiBold.fontSize}px;
  font-weight: 600;
  line-height: ${fontStyle.h3SemiBold.lineHeight}px;
  color: ${veranaCardColors.heading};
`;

export const DemoNoteTextStyled = styled(Text)`
  font-family: ${fontStyle.h4Regular.fontFamily};
  font-size: ${fontStyle.h4Regular.fontSize}px;
  font-weight: ${fontStyle.h4Regular.fontWeight};
  line-height: ${fontStyle.h4Regular.lineHeight}px;
  color: ${veranaCardColors.warning};
`;
