export enum ArgType {
  String = "String",
  Number = "Number",
  Boolean = "Boolean",
  Object = "Object",
  Array = "Array",
  Guild = "Guild",
  Channel = "Channel",
  Member = "Member",
  User = "User",
  Role = "Role",
  Emoji = "Emoji",
  Attachment = "Attachment",
  Command = "Command",
  Event = "Event",
  Function = "Function",
}

export interface IExtendedCompiledFunctionField {
  name: string;
  code: string;
}

export class NativeFunction {
  name: string;
  version: string;
  description: string;
  unwrap: boolean;
  brackets: boolean;
  args: any[];
  output?: ArgType;
  data: any;
  execute: Function;
  constructor(data: any) {
    this.name = data.name;
    this.version = data.version;
    this.description = data.description;
    this.unwrap = data.unwrap ?? false;
    this.brackets = data.brackets ?? false;
    this.args = data.args ?? [];
    this.output = data.output;
    this.data = data;
    this.execute = data.execute;
  }

  success(value: any) {
    return { success: true, value };
  }

  error(message: string) {
    return { success: false, error: message };
  }

  customError(message: string) {
    return this.error(message);
  }
}

export type Return = {
  success: boolean;
  value?: any;
  error?: any;
};
