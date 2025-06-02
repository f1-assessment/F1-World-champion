import { IConstructor } from '../types/index.js';
declare const findOrCreateConstructor: (constructorData: Partial<IConstructor>) => Promise<IConstructor>;
declare const getAllConstructors: () => Promise<IConstructor[]>;
declare const getConstructorById: (constructorId: string) => Promise<IConstructor | null>;
export { findOrCreateConstructor, getAllConstructors, getConstructorById };
//# sourceMappingURL=constructorService.d.ts.map