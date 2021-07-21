declare class PointSource<TObject extends PlaceableObject> {
    constructor(object: TObject, sourceType: PointSourceType);

    /** The object responsible for the PointSource */
    object: TObject;

    /** The type of source */
    sourceType: PointSourceType;

    /** The light or darkness container for this source */
    illumination: PIXI.Container;

    /**
     * This visible color container for this source
     */
    coloration: PIXI.Container;

    /** A flag for whether this source is currently active (rendered) or not */
    active: boolean;

    /** Internal flag for whether this is a darkness source */
    darkness: { min: number; max: number };

    /** Internal flag for whether this is a darkness  */
    isDarkness: boolean;

    /** Is the light source limited by an angle of emission? */
    limited: boolean;

    /** The maximum radius of emission for this source */
    radius: number;

    /** Internal flag for animation throttling time */
    protected _animateTime: number;

    /** An integer seed which de-synchronizes otherwise similar animations */
    protected _animateSeed: number | null;

    /** A flag for the lighting channels version that this source is using. */
    protected _lightingVersion: number;

    /** A flag for whether to re-initialize illumination shader uniforms the next time the light is rendered. */
    protected _resetIlluminationUniforms: boolean;

    /** A flag for whether to re-initialize coloration shader uniforms the next time the light is rendered. */
    protected _resetColorationUniforms: boolean;

    /** An internal flag for whether to render coloration for this source */
    protected _hasColor: boolean;

    // Always update polygons for the source as the environment may have changed
    fov: PIXI.Polygon;
    los: PIXI.Polygon;

    /** The default Geometry stored in the GPU for all Point Source meshes. */
    static GEOMETRY: PIXI.Geometry;

    /**
     * Create the structure of a source Container which can be rendered to the sight layer shadow-map
     * @return The constructed light source container
     */
    protected _createContainer(shaderCls: typeof PIXI.Shader): PIXI.Container;

    /**
     * Initialize the source with provided object data.
     *
     * @param data       Input data which configures the source.
     * @param data.x          The x-coordinate of the source location
     * @param data.y          The y-coordinate of the source location
     * @param data.z        An optional z-index sorting for the source
     * @param data.dim        The allowed radius of dim vision or illumination
     * @param data.bright     The allowed radius of bright vision or illumination
     * @param data.angle      The angle of emission for this point source
     * @param data.rotation   The angle of rotation for this point source
     * @param data.color      A tint color for the emitted light, if any
     * @param data.alpha      An opacity for the emitted light, if any
     * @param data.darkness   A darkness range (min and max) for which the source should be active
     * @param data.type       The source type from CONST.SOURCE_TYPES
     * @param data.animation  An animation configuration for the source
     * @param data.seed       An integer seed to synchronize (or de-synchronize) animations
     *
     * @return A reference to the initialized source
     */
    initialize(data?: {
        x?: number;
        y?: number;
        z?: number;
        dim?: number;
        bright?: number;
        angle?: number;
        rotation?: number;
        color: number;
        alpha?: number;
        darkness?: number;
        type?: PointSourceType;
        animation?: foundry.data.AnimationData;
        seed?: number;
    }): this;

    // Identify changes and assign cleaned data
    x: number;
    y: number;
    z: number;
    dim: number;
    bright: number;
    angle: number;
    rotation: number;
    color: number;
    alpha: number;
    type: PointSourceType;
    animation: foundry.data.AnimationSource | { type: null };

    // Derived data attributes

    colorRGB: [number, number, number];
    ratio: number;

    /**
     * Initialize the shaders used for this animation.
     * Reset the current shader values back to defaults.
     * Swap to a different Shader instance if necessary.
     */
    protected _initializeShaders(): void;

    /** Initialize the blend mode and vertical sorting of this source relative to others in the container. */
    protected _initializeBlending(): void;

    /* -------------------------------------------- */
    /*  Rendering                                   */
    /* -------------------------------------------- */

    /**
     * Draw the display of this source for the darkness/light container of the SightLayer.
     * @return The rendered light container
     */
    drawLight(): PIXI.Container;

    /**
     * Draw and return a container used to depict the visible color tint of the light source on the LightingLayer
     * @return An updated color container for the source
     */
    drawColor(): PIXI.Container;

    /**
     * A common helper function for updating the display of a source container.
     * Assign the container position, dimensions, and polygons.
     */
    protected _drawContainer(c: PIXI.Container): PIXI.Container;

    /* -------------------------------------------- */
    /*  Light Source Animation                      */
    /* -------------------------------------------- */

    /**
     * Animate the PointSource, if an animation is enabled and if it currently has rendered containers.
     * @param dt Delta time
     */
    animate(dt: number): void;
    /**
     * A torch animation where the luminosity and coloration decays each frame and is revitalized by flashes
     * @param dt        Delta time
     * @param speed     The animation speed, from 1 to 10
     * @param intensity The animation intensity, from 1 to 10
     */
    animateTorch(dt: number, { speed, intensity }?: { speed?: number; intensity?: number }): void;

    /**
     * A basic "pulse" animation which expands and contracts.
     * @param dt        Delta time
     * @param speed     The animation speed, from 1 to 10
     * @param intensity The animation intensity, from 1 to 10
     */
    animatePulse(dt: number, { speed, intensity }?: { speed?: number; intensity?: number }): void;

    /**
     * Emanate waves of light from the source origin point
     * @param dt        Delta time
     * @param speed     The animation speed, from 1 to 10
     * @param intensity The animation intensity, from 1 to 10
     */
    animateTime(dt: number, { speed, intensity }?: { speed?: number; intensity?: number }): void;
    /**
     * Evolve a value using a stochastic AR(1) process
     * @param y      The current value
     * @param phi    The decay rate of prior values
     * @param center The stationary mean of the series
     * @param sigma  The volatility of the process - standard deviation of the error term
     * @param max    The maximum allowed outcome, or null
     * @param min    The minimum allowed outcome, or null
     * @return The new value of the process
     */
    protected _ar1(
        y: number,
        {
            phi,
            center,
            sigma,
            max,
            min,
        }?: { phi?: number; center?: number; sigma?: number; max?: number | null; min?: number | null },
    ): number;
}

declare type PointSourceType = 'light' | 'sight';
