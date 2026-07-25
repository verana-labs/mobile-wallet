import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {SSICheckmarkBadge, SSITextH7LightStyled} from '@sphereon/ui-components.ssi-react-native';
import React, {FC, ReactElement} from 'react';
import {TouchableOpacity, View, ViewStyle} from 'react-native';
import {VERANA_REGISTRY_NAME} from '../../../@config/constants';
import Localization from '../../../localization/Localization';
import {VeranaTrustResolution} from '../../../services/veranaTrustService';
import {
  FederationTrustViewContainerStyled as Container,
  FederationTrustViewContentContainerStyled as ContentContainer,
  FederationTrustViewDescriptionTextStyled as DescriptionText,
  FederationTrustViewHeaderContainerStyled as HeaderContainer,
  FederationTrustViewIconContainerStyled as IconContainer,
  FederationTrustViewTitleTextStyled as TitleText,
} from '../../../styles/components/components/FederationTrustView';
import {ScreenRoutesEnum, StackParamList} from '../../../types';
import ArrowIcon from '../../assets/icons/ArrowIcon';
import ShieldIcon from '../../assets/icons/ShieldIcon';

export type Props = {
  partyName: string;
  resolution?: VeranaTrustResolution;
  style?: ViewStyle;
};

const VeranaTrustView: FC<Props> = (props: Props): ReactElement | null => {
  const {partyName, resolution, style} = props;
  const navigation = useNavigation<NativeStackNavigationProp<StackParamList>>();

  // Fail-closed: only a positive TRUSTED resolution renders anything at all.
  if (resolution?.trustStatus !== 'TRUSTED') {
    return null;
  }

  const onPress = async (): Promise<void> => {
    navigation.navigate(ScreenRoutesEnum.VERANA_TRUST_DETAILS, {resolution, partyName});
  };

  return (
    <Container accessibilityLabel="Verana trust view" isTrusted={true} style={{...style}}>
      <IconContainer>
        <ShieldIcon isProtected={true} color={'#B1EBC9'} />
      </IconContainer>
      <ContentContainer>
        <HeaderContainer>
          <TitleText accessible isTrusted={true}>
            {Localization.translate('verana_view_trusted_title', {partyName})}
          </TitleText>
          <DescriptionText isTrusted={true}>{Localization.translate('verana_view_trusted_description')}</DescriptionText>
        </HeaderContainer>
        <TouchableOpacity accessibilityRole="link" style={{height: 42, alignItems: 'center', flexDirection: 'row'}} onPress={onPress}>
          <View style={{flexDirection: 'row', gap: 12, alignItems: 'center', flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1}}>
              <SSITextH7LightStyled numberOfLines={2}>{VERANA_REGISTRY_NAME}</SSITextH7LightStyled>
              <SSICheckmarkBadge />
            </View>
          </View>
          <View style={{height: 42, width: 42, marginLeft: 'auto', alignItems: 'center', justifyContent: 'center'}}>
            <ArrowIcon />
          </View>
        </TouchableOpacity>
      </ContentContainer>
    </Container>
  );
};

export default VeranaTrustView;
