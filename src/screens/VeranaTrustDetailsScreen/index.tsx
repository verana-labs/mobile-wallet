import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {backgroundColors, fontColors} from '@sphereon/ui-components.core';
import {SSITextH3LightStyled, SSITextH4LightStyled, SSITextH5LightStyled} from '@sphereon/ui-components.ssi-react-native';
import React, {FC, ReactElement, useEffect, useState} from 'react';
import {ActivityIndicator, Linking, ScrollView, TouchableOpacity, View} from 'react-native';
import {VERANA_REGISTRY_NAME, VERANA_RESOLVER_URL} from '../../@config/constants';
import ShieldIcon from '../../components/assets/icons/ShieldIcon';
import {translate} from '../../localization/Localization';
import {fetchVeranaTrustDetails, VeranaTrustCredential, VeranaTrustDetails} from '../../services/veranaTrustService';
import {SSIBasicContainerStyled as Container} from '../../styles/components';
import {ScreenRoutesEnum, StackParamList} from '../../types';

type Props = NativeStackScreenProps<StackParamList, ScreenRoutesEnum.VERANA_TRUST_DETAILS>;

const asString = (value: unknown): string | undefined => (typeof value === 'string' && value.length > 0 ? value : undefined);

export const asHttpUrl = (value: unknown): string | undefined => {
  const url = asString(value);
  if (!url) {
    return undefined;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === 'https:' || parsed.protocol === 'http:' ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
};

const ecsTypeLabel = (ecsType?: string): string => {
  switch (ecsType) {
    case 'ECS-SERVICE':
      return translate('verana_details_credential_service_label');
    case 'ECS-ORG':
      return translate('verana_details_credential_org_label');
    case 'ECS-PERSON':
      return translate('verana_details_credential_person_label');
    default:
      return ecsType ?? translate('verana_details_credential_generic_label');
  }
};

const Section: FC<{title: string; children: React.ReactNode}> = ({title, children}) => (
  <View style={{paddingHorizontal: 24, paddingTop: 20}}>
    <SSITextH3LightStyled accessibilityRole="header">{title}</SSITextH3LightStyled>
    <View style={{marginTop: 8, gap: 12}}>{children}</View>
  </View>
);

const Field: FC<{label: string; value?: string}> = ({label, value}) =>
  value ? (
    <View>
      <SSITextH5LightStyled style={{opacity: 0.6}}>{label}</SSITextH5LightStyled>
      <SSITextH4LightStyled>{value}</SSITextH4LightStyled>
    </View>
  ) : null;

const LinkField: FC<{label: string; url?: string}> = ({label, url}) =>
  url ? (
    <View>
      <SSITextH5LightStyled style={{opacity: 0.6}}>{label}</SSITextH5LightStyled>
      <TouchableOpacity accessibilityRole="link" onPress={() => Linking.openURL(url)}>
        <SSITextH4LightStyled style={{color: '#7276F7'}} numberOfLines={1}>
          {url}
        </SSITextH4LightStyled>
      </TouchableOpacity>
    </View>
  ) : null;

const CredentialCard: FC<{credential: VeranaTrustCredential}> = ({credential}) => {
  const claims = credential.claims ?? {};
  const isService = credential.ecsType === 'ECS-SERVICE';
  return (
    <View style={{backgroundColor: backgroundColors.secondaryDark, borderRadius: 8, padding: 16, gap: 10}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
        <ShieldIcon isProtected={true} color={'#B1EBC9'} />
        <View style={{flex: 1}}>
          <SSITextH4LightStyled>{asString(claims.name) ?? ecsTypeLabel(credential.ecsType)}</SSITextH4LightStyled>
          <SSITextH5LightStyled style={{opacity: 0.6}}>
            {ecsTypeLabel(credential.ecsType)} · {credential.result ?? 'VALID'}
          </SSITextH5LightStyled>
        </View>
      </View>
      {isService ? (
        <>
          <Field label={translate('verana_details_field_type')} value={asString(claims.type)} />
          <Field label={translate('verana_details_field_description')} value={asString(claims.description)} />
          <LinkField label={translate('verana_details_field_privacy_policy')} url={asHttpUrl(claims.privacyPolicy)} />
          <LinkField label={translate('verana_details_field_terms_and_conditions')} url={asHttpUrl(claims.termsAndConditions)} />
        </>
      ) : (
        <>
          <Field label={translate('verana_details_field_legal_name')} value={asString(claims.name)} />
          <Field label={translate('verana_details_field_address')} value={asString(claims.address)} />
          <Field label={translate('verana_details_field_registry_id')} value={asString(claims.registryId)} />
          <Field label={translate('verana_details_field_country')} value={asString(claims.countryCode)} />
        </>
      )}
    </View>
  );
};

const VeranaTrustDetailsScreen: FC<Props> = (props: Props): ReactElement => {
  const {resolution, partyName} = props.route.params;
  const [details, setDetails] = useState<VeranaTrustDetails | undefined>();
  const [loading, setLoading] = useState<boolean>(true);

  // The full evaluation (Verifiable Trust Credentials + ecosystem chain) is fetched lazily here,
  // off the presentation flow's critical path: it runs a slow two-pass on-chain evaluation.
  useEffect(() => {
    let active = true;
    fetchVeranaTrustDetails(resolution.did)
      .then(result => {
        if (active) {
          setDetails(result);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [resolution.did]);

  const ecosystemDid = details?.credentials?.map(credential => credential.issuedBy).find(issuedBy => !!issuedBy);

  return (
    <Container>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: 32}}>
        <View style={{paddingHorizontal: 24, paddingTop: 20, flexDirection: 'row', alignItems: 'center', gap: 12}}>
          <ShieldIcon isProtected={true} color={'#B1EBC9'} width={24} height={27} />
          <View style={{flex: 1}}>
            <SSITextH3LightStyled accessibilityRole="header">{partyName ?? VERANA_REGISTRY_NAME}</SSITextH3LightStyled>
            <SSITextH5LightStyled style={{opacity: 0.7, marginTop: 2}}>
              {resolution.trustStatus}
              {resolution.production ? ` · ${translate('verana_details_production_label')}` : ''}
              {resolution.evaluatedAtBlock ? ` · ${translate('verana_details_block_label', {block: `${resolution.evaluatedAtBlock}`})}` : ''}
            </SSITextH5LightStyled>
          </View>
        </View>

        <Section title={translate('verana_details_verdict_section_title')}>
          <Field label={translate('verana_details_field_did')} value={resolution.did} />
          <Field label={translate('verana_details_field_evaluated_at')} value={resolution.evaluatedAt} />
          <Field label={translate('verana_details_field_expires_at')} value={resolution.expiresAt} />
        </Section>

        <Section title={translate('verana_details_credentials_section_title')}>
          {loading ? (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: 10}}>
              <ActivityIndicator color={fontColors.light} />
              <SSITextH5LightStyled style={{opacity: 0.7}}>{translate('verana_details_credentials_loading')}</SSITextH5LightStyled>
            </View>
          ) : details && details.credentials.length > 0 ? (
            details.credentials.map((credential, index) => <CredentialCard key={index} credential={credential} />)
          ) : (
            <SSITextH5LightStyled style={{opacity: 0.7}}>{translate('verana_details_credentials_empty')}</SSITextH5LightStyled>
          )}
        </Section>

        {ecosystemDid && (
          <Section title={translate('verana_details_ecosystem_section_title')}>
            <Field label={translate('verana_details_field_ecosystem_did')} value={ecosystemDid} />
          </Section>
        )}

        <Section title={translate('verana_details_registry_section_title')}>
          <Field label={translate('verana_details_field_registry')} value={VERANA_REGISTRY_NAME} />
          <Field label={translate('verana_details_field_resolver')} value={VERANA_RESOLVER_URL} />
        </Section>
      </ScrollView>
    </Container>
  );
};

export default VeranaTrustDetailsScreen;
