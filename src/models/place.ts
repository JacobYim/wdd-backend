import { Schema } from 'mongoose';
import { arrayProp, index, prop, Typegoose } from 'typegoose';
import { ClassInstance } from '../interfaces/model';
import { Location } from './schemas/location';

interface OfficeHour {
  default: string;
  weekend?: string;
  dayoff?: string;
}

@index({ location: '2dsphere' })
@index({ name: 'text', address: 'text' })
export class Place extends Typegoose {
  @prop({ required: true })
  name!: string;
  @prop({ required: true })
  location!: ClassInstance<Location>;
  @prop({ required: true })
  address!: string; // Road Address
  @prop({ default: 'OTHER' })
  label!: 'CAFE' | 'SHOP' | 'HOSPITAL' | 'OTHER';
  @prop({ min: 0, max: 5, default: 0 })
  rating!: number;
  @prop({ match: /^(0\d{1,2}-)?\d{3,4}-\d{4}$/ })
  contact!: string;
  @prop()
  thumbnail?: string;
  @prop()
  officeHour?: OfficeHour;
  @arrayProp({ items: String })
  images!: string[];
  @arrayProp({ items: Schema.Types.ObjectId, itemsRef: 'User' })
  likes?: Schema.Types.ObjectId[];
}

const placeModel = new Place().getModelForClass(Place);

export default placeModel;
