import * as React from 'react';
export declare type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
export declare type Shared<A, B> = {
    [P in Extract<keyof A, keyof B>]?: A[P] extends B[P] ? B[P] : never;
} & {
    [P in Extract<keyof B, keyof A>]?: B[P] extends A[P] ? A[P] : never;
};
/**
 * Extract the type of "P" for a given React component
 */
export declare type PropsOf<C> = C extends new (props: infer P) => React.Component ? P : C extends (props: infer P) => React.ReactElement<any> | null ? P : C extends React.Component<infer P> ? P : never;
export declare const withDefaultProps: <P, DP extends Partial<P>>(defaultProps: DP, Component: React.ComponentClass<P, any>) => React.ComponentClass<Partial<Pick<P, Exclude<keyof P, Exclude<keyof P, Extract<keyof P, keyof DP> | Extract<keyof DP, keyof P>>>>> & Pick<P, Exclude<keyof P, Extract<keyof P, keyof DP> | Extract<keyof DP, keyof P>>>, any>;
export declare type ResultantProps<InjectedProps, P extends InjectedProps> = Omit<P, keyof InjectedProps>;
/**
 * This type is used for HOC's that do not inject any props rather just render
 * the component in a special way.  The resultant component can take in additional
 * props.
 *
 * Example usage:
 *
 * const withDeprecationWarnings: PropsPasser<AppearanceProps> = (
 *  Component,
 * ) => {
 *   return class WithDeprecationWarnings extends React.Component<PropsOf<typeof Component> & AppearanceProps> {
 *     static displayName = `WithDeprecationWarnings(${getComponentName(
 *       Component,
 *     )})`;
 *
 *     componentWillMount() {
 *       warnIfDeprecatedAppearance(this.props.appearance);
 *     }
 *
 *     componentWillReceiveProps(newProps: AppearanceProps) {
 *       if (newProps.appearance !== this.props.appearance) {
 *         warnIfDeprecatedAppearance(newProps.appearance);
 *       }
 *     }
 *
 *     render() {
 *       return React.createElement(Component, this.props as any);
 *     }
 *   };
 * };
 */
export declare type PropsPasser<Extra extends object = {}> = <C extends React.ComponentClass>(Component: C) => React.ComponentClass<PropsOf<C> & Extra>;
/**
 * This type is used for HOC's that inject props into the provided component in
 * such a way that the resultant component does not accept those props any more
 */
export declare type PropsInjector<InjectedProps extends object> = <C extends React.ComponentClass<any>>(Component: C) => React.ComponentClass<Omit<PropsOf<C>, keyof Shared<InjectedProps, PropsOf<C>>>>;
/**
 * Sometimes we want to utilse the power of Algebraic Data Types.
 * Meaning, ADTs behave similarly to algebra:
 *  - (a + b) * c === a * c + b * c
 *  - (A | B) & T === (A & T) | (B & T).
 *
 * As such, if I have props for my component as a
 * Sum type (also called variants), like this:
 *
 *  type Props = {a: number} | {b: string}
 *
 * and I want to build up NewProps by mixing-in:
 *
 *  type NewProps
 *    = Props & { data: bool }
 *    === ({a: number} & { data: bool } ) | ( {b: string} & { data: bool } )
 */
export declare type SumPropsInjector<InjectedProps extends object> = <C extends React.ComponentClass<any>>(Component: C) => React.ComponentClass<PropsOf<C> & InjectedProps>;
