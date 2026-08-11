import React, {FC, ReactElement, ReactNode} from 'react';
import {
  describeVerdict,
  findOrganizationCredential,
  findServiceCredential,
  readEcsOrganization,
  readEcsService,
  stripLinks,
} from '../../../services/veranaEcs';
import type {VeranaTrustCredential, VeranaTrustResolution} from '../../../services/veranaTrustService';
import {
  CheckIcon,
  ConditionRow,
  CrossIcon,
  DidRow,
  IdentityHeading,
  InfoIcon,
  LogoBadge,
  RegistryChip,
  SectionLabel,
  StepTick,
  type StepTone,
  VerdictPill,
} from '../VeranaTrustCard';
import {veranaCardColors} from '../VeranaTrustCard/styles';
import {
  AgeBadgeTextStyled,
  AgeRowStyled,
  AskContainerStyled,
  AskCredentialTextStyled,
  AskLineStyled,
  BodyTextStyled,
  ChainStackStyled,
  ChainStepsStyled,
  ChipsRowStyled,
  ConditionsContainerStyled,
  DemoNoteTextStyled,
  FailureTextStyled,
  LoadingTextStyled,
  RetryButtonStyled,
  RetryButtonTextStyled,
  StepBodyStyled,
  StepIdentityRowStyled,
  StepRailColumnStyled,
  StepRailStyled,
  StepRowStyled,
  StepTextColumnStyled,
  SubTextStyled,
} from './styles';

export type VeranaAccreditationResult = {
  granted: boolean | undefined;
  reason: string;
};

export type VeranaTrustAsk = {
  kind: 'offer' | 'request';
  granted?: boolean;
  party?: string;
  credential: string;
  ecosystem?: string;
  reason?: string;
};

export type VeranaTrustChainProps = {
  resolution?: VeranaTrustResolution;
  credentials?: VeranaTrustCredential[];
  isLoading: boolean;
  onRetry?: () => void;
  accreditation?: VeranaAccreditationResult;
  ask?: VeranaTrustAsk;
  partyName?: string;
};

// A structurally VALID credential can still verify nothing: the untrusted demo services issue their
// ECS credentials to themselves, so the tick follows the resolution and self-issued claims are withheld.
const selfIssued = (credential: VeranaTrustCredential | undefined, did: string): boolean =>
  Boolean(credential?.issuedBy && credential.issuedBy.split('#')[0] === did);

type ChainStepProps = {
  tone: StepTone;
  label: string;
  isLast?: boolean;
  children: ReactNode;
};

const ChainStep: FC<ChainStepProps> = ({tone, label, isLast, children}) => {
  const railColor = tone === 'ok' ? veranaCardColors.positiveRail : tone === 'bad' ? veranaCardColors.dangerRail : veranaCardColors.neutralRail;
  return (
    <StepRowStyled>
      <StepRailColumnStyled>
        <StepTick tone={tone} />
        {!isLast ? <StepRailStyled railColor={railColor} /> : null}
      </StepRailColumnStyled>
      <StepBodyStyled isLast={isLast}>
        <SectionLabel>{label}</SectionLabel>
        {children}
      </StepBodyStyled>
    </StepRowStyled>
  );
};

type AskBlockProps = {
  ask: VeranaTrustAsk;
  granted: boolean | undefined;
  reason?: string;
  fallbackParty: string;
};

const AskBlock: FC<AskBlockProps> = ({ask, granted, reason, fallbackParty}) => {
  const verb = ask.kind === 'offer' ? 'authorized issuer' : 'authorized verifier';
  const party = ask.party ?? fallbackParty;
  const isGranted = granted === true;
  const askBorderColor = granted === undefined ? veranaCardColors.border : isGranted ? veranaCardColors.positive : veranaCardColors.danger;
  const askBackgroundColor =
    granted === undefined ? veranaCardColors.neutralSoft : isGranted ? veranaCardColors.positiveSoft : veranaCardColors.dangerSoft;

  return (
    <AskContainerStyled askBorderColor={askBorderColor} askBackgroundColor={askBackgroundColor}>
      <SectionLabel>{ask.kind === 'offer' ? 'Offers you' : 'Asks you for'}</SectionLabel>
      <AskCredentialTextStyled>{ask.credential}</AskCredentialTextStyled>
      <AskLineStyled>
        {granted === undefined ? (
          <InfoIcon color={veranaCardColors.sub} size={18} />
        ) : isGranted ? (
          <CheckIcon color={veranaCardColors.positiveText} size={18} />
        ) : (
          <CrossIcon color={veranaCardColors.danger} size={18} />
        )}
        <BodyTextStyled>
          {granted === undefined
            ? reason || 'This could not be checked against the registry.'
            : `${party} is ${isGranted ? 'an' : 'not an'} ${verb} of ${ask.credential}${ask.ecosystem ? ` in ${ask.ecosystem}` : ''}`}
        </BodyTextStyled>
      </AskLineStyled>
    </AskContainerStyled>
  );
};

export const VeranaTrustChain: FC<VeranaTrustChainProps> = ({
  resolution,
  credentials,
  isLoading,
  onRetry,
  accreditation,
  ask,
  partyName,
}): ReactElement | null => {
  if (!resolution) {
    return isLoading ? <LoadingTextStyled>Resolving trust credentials…</LoadingTextStyled> : null;
  }

  const did = resolution.did;
  const verdict = resolution.trustStatus;
  const testnet = !resolution.production;
  const chainCredentials = credentials ?? [];

  const serviceCredential = findServiceCredential(chainCredentials);
  const organizationCredential = findOrganizationCredential(chainCredentials);

  const rowTone = (credential: VeranaTrustCredential | undefined): StepTone => {
    if (verdict === 'UNVERIFIED') {
      return 'none';
    }
    if (verdict === 'UNTRUSTED') {
      return 'bad';
    }
    return credential?.result === 'VALID' ? 'ok' : 'bad';
  };
  const serviceTone = rowTone(serviceCredential);
  const organizationTone = rowTone(organizationCredential);

  const service = serviceTone === 'ok' ? readEcsService(serviceCredential) : undefined;
  const organization = organizationTone === 'ok' ? readEcsOrganization(organizationCredential) : undefined;

  const withheld = (credential: VeranaTrustCredential | undefined, tone: StepTone): string | undefined =>
    tone === 'none'
      ? 'Not checked.'
      : credential
      ? selfIssued(credential, did)
        ? 'Issued by this service to itself, so nothing independent verifies it.'
        : 'Nothing in the registry vouches for this credential, so its claims are not shown.'
      : undefined;

  const serviceWithheld = withheld(serviceCredential, serviceTone);
  const organizationWithheld = withheld(organizationCredential, organizationTone);
  const description = stripLinks(service?.description);
  const hasConditions = Boolean(service?.terms || service?.privacy || service?.minimumAgeRequired);
  const note =
    verdict === 'UNVERIFIED'
      ? 'The Verana resolver could not be reached. This counterparty is neither trusted nor untrusted.'
      : chainCredentials.length > 0
      ? describeVerdict(verdict, chainCredentials)
      : undefined;

  return (
    <ChainStackStyled accessibilityLabel="Verana trust chain">
      <DidRow did={did} verdict={verdict} testnet={testnet} />

      {isLoading ? <LoadingTextStyled>Resolving trust credentials…</LoadingTextStyled> : null}

      {chainCredentials.length > 0 ? (
        <ChainStepsStyled>
          <ChainStep tone={serviceTone} label="Service">
            {service ? (
              <StepIdentityRowStyled>
                <LogoBadge name={service.name} verified={Boolean(service.logo?.digest)} />
                <StepTextColumnStyled>
                  <IdentityHeading name={service.name} />
                  {description.text ? <BodyTextStyled>{description.text}</BodyTextStyled> : null}
                  {description.removed > 0 ? (
                    <SubTextStyled>
                      {description.removed} link{description.removed > 1 ? 's' : ''} removed from this description before display
                    </SubTextStyled>
                  ) : null}
                </StepTextColumnStyled>
              </StepIdentityRowStyled>
            ) : (
              <>
                <FailureTextStyled failureColor={serviceTone === 'none' ? veranaCardColors.sub : veranaCardColors.danger}>
                  {serviceCredential ? 'Service claims not verified' : 'No ECS-Service credential presented'}
                </FailureTextStyled>
                {serviceWithheld ? <SubTextStyled>{serviceWithheld}</SubTextStyled> : null}
              </>
            )}
          </ChainStep>

          <ChainStep tone={organizationTone} label="Operated by" isLast>
            {organization ? (
              <StepIdentityRowStyled>
                <LogoBadge name={organization.name} verified={Boolean(organization.logo?.digest)} />
                <StepTextColumnStyled>
                  <IdentityHeading name={organization.name} countryCode={organization.countryCode} />
                  {organization.address ? <BodyTextStyled>{organization.address}</BodyTextStyled> : null}
                  <ChipsRowStyled>
                    <RegistryChip label="REG" value={organization.registryId} />
                  </ChipsRowStyled>
                </StepTextColumnStyled>
              </StepIdentityRowStyled>
            ) : (
              <>
                <FailureTextStyled failureColor={organizationTone === 'none' ? veranaCardColors.sub : veranaCardColors.danger}>
                  {organizationCredential ? 'Operator claims not verified' : 'No ECS-Organization credential presented'}
                </FailureTextStyled>
                <SubTextStyled>{organizationWithheld ?? 'Nothing verifies who operates this service'}</SubTextStyled>
              </>
            )}
          </ChainStep>
        </ChainStepsStyled>
      ) : null}

      <VerdictPill verdict={verdict} note={note} />

      {verdict === 'UNVERIFIED' && onRetry ? (
        <RetryButtonStyled accessibilityRole="button" onPress={onRetry}>
          <RetryButtonTextStyled>Check again</RetryButtonTextStyled>
        </RetryButtonStyled>
      ) : null}

      {ask ? (
        <AskBlock
          ask={ask}
          granted={accreditation ? accreditation.granted : ask.granted}
          reason={accreditation?.reason ?? ask.reason}
          fallbackParty={partyName ?? did}
        />
      ) : null}

      {hasConditions ? (
        <ConditionsContainerStyled>
          <SectionLabel>Conditions of connecting</SectionLabel>
          {service?.minimumAgeRequired ? (
            <AgeRowStyled>
              <AgeBadgeTextStyled>{service.minimumAgeRequired}+</AgeBadgeTextStyled>
              <BodyTextStyled>This service requires you to be at least {service.minimumAgeRequired} to connect</BodyTextStyled>
            </AgeRowStyled>
          ) : (
            <AgeRowStyled>
              <InfoIcon color={veranaCardColors.sub} size={14} />
              <BodyTextStyled>No age restriction</BodyTextStyled>
            </AgeRowStyled>
          )}
          <ConditionRow asset={service?.terms} label="Terms & conditions" />
          <ConditionRow asset={service?.privacy} label="Privacy policy" />
        </ConditionsContainerStyled>
      ) : null}

      {testnet ? <DemoNoteTextStyled>Demo network - do not share real data</DemoNoteTextStyled> : null}
    </ChainStackStyled>
  );
};

export default VeranaTrustChain;
