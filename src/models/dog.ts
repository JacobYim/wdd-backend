import { Schema } from 'mongoose';
import { arrayProp, prop, Typegoose } from 'typegoose';

export class Dog extends Typegoose {
  @prop({ index: true, ref: 'User' })
  user!: Schema.Types.ObjectId;
  @prop({ required: true })
  name!: string;
  @prop()
  thumbnail?: string;
  @prop({ required: true })
  breed!: string;
  @prop({ required: true, uppercase: true, enum: ['M', 'F', 'N'] })
  gender!: 'M' | 'F' | 'N';
  @prop({ match: /^\d{4}.\d{2}.\d{2}$/ })
  birth?: string;
  @prop({ min: 0 })
  weight?: number;
  @prop()
  info?: string;
  @arrayProp({ items: Schema.Types.ObjectId, itemsRef: 'Feed', default: [] })
  feeds!: Schema.Types.ObjectId[];
  @arrayProp({ items: Schema.Types.ObjectId, itemsRef: 'Dog', default: [] })
  likes!: Schema.Types.ObjectId[];
}

const dogModel = new Dog().getModelForClass(Dog);

export default dogModel;
