/* 
 * The lists of props options for open peeps avatar:
 * https://github.com/CeamKrier/react-peeps
 */

import { random, sample } from 'lodash';
import { omit } from 'lodash';
import { cofactsColors } from '../../../lib/theme';
import { Hair, Face, FacialHair, BustPose, Accessories, SittingPose, StandingPose } from 'react-peeps';

const accessories = Object.keys(Accessories);
const faces = Object.keys(Face);
const facialHairStyles = Object.keys(FacialHair);
const hairStyles = Object.keys(Hair);
const bustPoses = Object.keys(BustPose);
const sittingPoses = Object.keys(SittingPose);
const standingPoses = Object.keys(StandingPose);

export const generateRandomOpenPeepsAvatar = () => {
  const accessory = random() ? sample(accessories) : 'None';
  const facialHair = random() ? sample(facialHairStyles) : 'None';
  const flip = !!random();
  const backgroundColorIndex = random(0, 1, true);

  const face = sample(faces);
  const hair = sample(hairStyles);
  const body = sample(bustPoses);

  return {
    accessory,
    body,
    face,
    hair,
    facialHair,
    backgroundColorIndex,
    flip,
  };
};

export const validateAvatarData = (data) => ({
    ...data,
    accessory: data.accessory && accessories.includes(data.accessory) ? data.accessory : '',
    body: data.body && bustPoses.includes(data.body) ? data.body : '',
    face: data.face && faces.includes(data.face) ? data.face : '',
    hair: data.hair && hairStyles.includes(data.hair) ? data.hair : '',
    facialHair: data.facialHair && facialHairStyles.includes(data.facialHair) ? data.facialHair : '',
})
  
export const colorOptions = Object.values(omit(cofactsColors, ['black', 'white']));
export const getBackgroundColor = ({ avatarData }) => {
  if (avatarData?.backgroundColor) return avatarData.backgroundColor;
  if (avatarData?.backgroundColorIndex) {
    const index = Math.floor(
      colorOptions.length * avatarData.backgroundColorIndex
    );
    return colorOptions[index];
  }
  return cofactsColors.yellow;
}