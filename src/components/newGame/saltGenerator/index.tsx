import { useState } from 'react';
import { PlayerMove } from '../types';
import { ethers } from 'ethers';
import { Hash } from 'viem';

import { CopyText, FormRow, Input, Label, SaltMessage } from '../styled';

import Button from '../../button';
import { publicClient } from '../../../config/provider';
import { hasherContract } from '../../../data/config';
import { copytoClipborad } from '../../../utils/copyToClipboard';

import CheckIcon from '../../icons/Check';
import CopyCheckIcon from '../../icons/CopyCheck';

const generateSalt = async (move: PlayerMove): Promise<Hash> => {
  const secret = ethers.hexlify(ethers.randomBytes(32));
  const salt = await (publicClient as any).readContract({
    ...hasherContract,
    functionName: 'hash',
    args: [move, secret],
  });
  return salt;
};

const SaltGenerator: React.FC<{
  move: PlayerMove;
  generatedSalt: string | null;
  setGeneratedSalt: React.Dispatch<React.SetStateAction<string | null>>;
}> = ({ move, generatedSalt, setGeneratedSalt }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerateSalt = async () => {
    try {
      const salt = await generateSalt(move);
      setGeneratedSalt(salt);
      setIsCopied(false);
    } catch (error) {
      console.error('Error generating salt:', error);
    }
  };

  return (
    <>
      <Label>Generate salt</Label>
      <FormRow>
        <Input type='text' disabled value={generatedSalt || ''} readOnly />
        <Button size='small' onClick={handleGenerateSalt}>
          generate
        </Button>
      </FormRow>
      {generatedSalt && (
        <SaltMessage>
          Please copy and keep safe your salt.
          <span
            onClick={() => {
              copytoClipborad(generatedSalt);
              setIsCopied(true);
            }}
          >
            {isCopied ? (
              <CopyText>
                <CheckIcon /> Copied
              </CopyText>
            ) : (
              <CopyText>
                <CopyCheckIcon /> Copy
              </CopyText>
            )}
          </span>
        </SaltMessage>
      )}
    </>
  );
};

export default SaltGenerator;
