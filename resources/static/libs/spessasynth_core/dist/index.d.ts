/**
 * Indexed_array.ts
 * purpose: extends Uint8Array with a currentIndex property.
 */
declare class IndexedByteArray extends Uint8Array {
    /**
     * The current index of the array.
     */
    currentIndex: number;
    /**
     * Returns a section of an array.
     * @param start The beginning of the specified portion of the array.
     * @param end The end of the specified portion of the array. This is exclusive of the element at the index 'end'.
     */
    slice(start?: number, end?: number): IndexedByteArray;
}

/**
 * Reads number as Big endian.
 * @param dataArray the array to read from.
 * @param bytesAmount the number of bytes to read.
 * @param offset the offset to start reading from.
 * @returns the number.
 */
declare function readBigEndian(dataArray: number[] | ArrayLike<number>, bytesAmount: number, offset?: number): number;

/**
 * Reads the number as little endian from an IndexedByteArray.
 * @param dataArray the array to read from.
 * @param bytesAmount the number of bytes to read.
 * @returns the number.
 */
declare function readLittleEndianIndexed(dataArray: IndexedByteArray, bytesAmount: number): number;

/**
 * Reads bytes as an ASCII string from an IndexedByteArray.
 * @param dataArray the IndexedByteArray to read from.
 * @param bytes the amount of bytes to read.
 * @returns the string.
 */
declare function readBinaryStringIndexed(dataArray: IndexedByteArray, bytes: number): string;

/**
 * Reads VLQ from a MIDI byte array.
 * @param MIDIbyteArray the array to read from.
 * @returns the number.
 */
declare function readVariableLengthQuantity(MIDIbyteArray: IndexedByteArray): number;

/**
 * Enables or disables logging.
 * @param enableInfo enables info.
 * @param enableWarn enables warning.
 * @param enableGroup enables groups.
 */
declare function SpessaSynthLogging(enableInfo: boolean, enableWarn: boolean, enableGroup: boolean): void;
declare function SpessaSynthInfo(...message: unknown[]): void;
declare function SpessaSynthWarn(...message: unknown[]): void;
declare function SpessaSynthGroup(...message: unknown[]): void;
declare function SpessaSynthGroupCollapsed(...message: unknown[]): void;
declare function SpessaSynthGroupEnd(): void;

/**
 * Writes an audio into a valid WAV file.
 * @param audioData the audio data channels.
 * @param sampleRate the sample rate, in Hertz.
 * @param options Additional options for writing the file.
 * @returns the binary file.
 */
declare function audioToWav(audioData: Float32Array[], sampleRate: number, options?: Partial<WaveWriteOptions>): ArrayBuffer;

/**
 * All SoundFont2 Generator enumerations.
 */
declare const generatorTypes: Readonly<{
    readonly INVALID: -1;
    readonly startAddrsOffset: 0;
    readonly endAddrOffset: 1;
    readonly startloopAddrsOffset: 2;
    readonly endloopAddrsOffset: 3;
    readonly startAddrsCoarseOffset: 4;
    readonly modLfoToPitch: 5;
    readonly vibLfoToPitch: 6;
    readonly modEnvToPitch: 7;
    readonly initialFilterFc: 8;
    readonly initialFilterQ: 9;
    readonly modLfoToFilterFc: 10;
    readonly modEnvToFilterFc: 11;
    readonly endAddrsCoarseOffset: 12;
    readonly modLfoToVolume: 13;
    readonly unused1: 14;
    readonly chorusEffectsSend: 15;
    readonly reverbEffectsSend: 16;
    readonly pan: 17;
    readonly unused2: 18;
    readonly unused3: 19;
    readonly unused4: 20;
    readonly delayModLFO: 21;
    readonly freqModLFO: 22;
    readonly delayVibLFO: 23;
    readonly freqVibLFO: 24;
    readonly delayModEnv: 25;
    readonly attackModEnv: 26;
    readonly holdModEnv: 27;
    readonly decayModEnv: 28;
    readonly sustainModEnv: 29;
    readonly releaseModEnv: 30;
    readonly keyNumToModEnvHold: 31;
    readonly keyNumToModEnvDecay: 32;
    readonly delayVolEnv: 33;
    readonly attackVolEnv: 34;
    readonly holdVolEnv: 35;
    readonly decayVolEnv: 36;
    readonly sustainVolEnv: 37;
    readonly releaseVolEnv: 38;
    readonly keyNumToVolEnvHold: 39;
    readonly keyNumToVolEnvDecay: 40;
    readonly instrument: 41;
    readonly reserved1: 42;
    readonly keyRange: 43;
    readonly velRange: 44;
    readonly startloopAddrsCoarseOffset: 45;
    readonly keyNum: 46;
    readonly velocity: 47;
    readonly initialAttenuation: 48;
    readonly reserved2: 49;
    readonly endloopAddrsCoarseOffset: 50;
    readonly coarseTune: 51;
    readonly fineTune: 52;
    readonly sampleID: 53;
    readonly sampleModes: 54;
    readonly reserved3: 55;
    readonly scaleTuning: 56;
    readonly exclusiveClass: 57;
    readonly overridingRootKey: 58;
    readonly unused5: 59;
    readonly endOper: 60;
    readonly amplitude: 61;
    readonly vibLfoRate: 62;
    readonly vibLfoAmplitudeDepth: 63;
    readonly vibLfoToFilterFc: 64;
    readonly modLfoRate: 65;
    readonly modLfoAmplitudeDepth: 66;
}>;
type GeneratorType = (typeof generatorTypes)[keyof typeof generatorTypes];
declare const GENERATORS_AMOUNT: number;
declare const MAX_GENERATOR: number;
/**
 * Min: minimum value, max: maximum value, def: default value, nrpn: nrpn scale
 */
declare const generatorLimits: Readonly<Record<number, {
    min: number;
    max: number;
    def: number;
    nrpn: number;
}>>;
declare const defaultGeneratorValues: Int16Array<ArrayBuffer>;

declare const sampleTypes: {
    readonly monoSample: 1;
    readonly rightSample: 2;
    readonly leftSample: 4;
    readonly linkedSample: 8;
    readonly romMonoSample: 32769;
    readonly romRightSample: 32770;
    readonly romLeftSample: 32772;
    readonly romLinkedSample: 32776;
};
type SampleType = (typeof sampleTypes)[keyof typeof sampleTypes];
declare const modulatorSources: {
    readonly noController: 0;
    readonly noteOnVelocity: 2;
    readonly noteOnKeyNum: 3;
    readonly polyPressure: 10;
    readonly channelPressure: 13;
    readonly pitchWheel: 14;
    readonly pitchWheelRange: 16;
    readonly link: 127;
};
type ModulatorSourceEnum = (typeof modulatorSources)[keyof typeof modulatorSources];
declare const modulatorCurveTypes: {
    readonly linear: 0;
    readonly concave: 1;
    readonly convex: 2;
    readonly switch: 3;
};
type ModulatorCurveType = (typeof modulatorCurveTypes)[keyof typeof modulatorCurveTypes];
declare const modulatorTransformTypes: {
    readonly linear: 0;
    readonly absolute: 2;
};
type ModulatorTransformType = (typeof modulatorTransformTypes)[keyof typeof modulatorTransformTypes];
type DLSTransform = ModulatorCurveType;
declare const dlsSources: {
    readonly none: 0;
    readonly modLfo: 1;
    readonly velocity: 2;
    readonly keyNum: 3;
    readonly volEnv: 4;
    readonly modEnv: 5;
    readonly pitchWheel: 6;
    readonly polyPressure: 7;
    readonly channelPressure: 8;
    readonly vibratoLfo: 9;
    readonly modulationWheel: 129;
    readonly volume: 135;
    readonly pan: 138;
    readonly expression: 139;
    readonly chorus: 221;
    readonly reverb: 219;
    readonly pitchWheelRange: 256;
    readonly fineTune: 257;
    readonly coarseTune: 258;
};
type DLSSource = (typeof dlsSources)[keyof typeof dlsSources];
declare const dlsDestinations: {
    readonly none: 0;
    readonly gain: 1;
    readonly reserved: 2;
    readonly pitch: 3;
    readonly pan: 4;
    readonly keyNum: 5;
    readonly chorusSend: 128;
    readonly reverbSend: 129;
    readonly modLfoFreq: 260;
    readonly modLfoDelay: 261;
    readonly vibLfoFreq: 276;
    readonly vibLfoDelay: 277;
    readonly volEnvAttack: 518;
    readonly volEnvDecay: 519;
    readonly reservedEG1: 520;
    readonly volEnvRelease: 521;
    readonly volEnvSustain: 522;
    readonly volEnvDelay: 523;
    readonly volEnvHold: 524;
    readonly modEnvAttack: 778;
    readonly modEnvDecay: 779;
    readonly reservedEG2: 780;
    readonly modEnvRelease: 781;
    readonly modEnvSustain: 782;
    readonly modEnvDelay: 783;
    readonly modEnvHold: 784;
    readonly filterCutoff: 1280;
    readonly filterQ: 1281;
};
type DLSDestination = (typeof dlsDestinations)[keyof typeof dlsDestinations];
declare const DLSLoopTypes: {
    readonly forward: 0;
    readonly loopAndRelease: 1;
};
type DLSLoopType = (typeof DLSLoopTypes)[keyof typeof DLSLoopTypes];

declare class LowpassFilter {
    /**
     * For smoothing the filter cutoff frequency.
     */
    static smoothingConstant: number;
    /**
     * Cached coefficient calculations.
     * stored as cachedCoefficients[resonanceCb + currentInitialFc * 961].
     */
    private static cachedCoefficients;
    /**
     * Resonance in centibels.
     */
    resonanceCb: number;
    /**
     * Current cutoff frequency in absolute cents.
     */
    currentInitialFc: number;
    /**
     * Filter coefficient 1.
     */
    a0: number;
    /**
     * Filter coefficient 2.
     */
    a1: number;
    /**
     * Filter coefficient 3.
     */
    a2: number;
    /**
     * Filter coefficient 4.
     */
    a3: number;
    /**
     * Filter coefficient 5.
     */
    a4: number;
    /**
     * Input history 1.
     */
    x1: number;
    /**
     * Input history 2.
     */
    x2: number;
    /**
     * Output history 1.
     */
    y1: number;
    /**
     * Output history 2.
     */
    y2: number;
    /**
     * For tracking the last cutoff frequency in the apply method, absolute cents.
     * Set to infinity to force recalculation.
     */
    lastTargetCutoff: number;
    /**
     * Used for tracking if the filter has been initialized.
     */
    initialized: boolean;
    /**
     * Filter's sample rate in Hz.
     */
    private readonly sampleRate;
    /**
     * Maximum cutoff frequency in Hz.
     * This is used to prevent aliasing and ensure the filter operates within the valid frequency range.
     */
    private readonly maxCutoff;
    /**
     * Initializes a new instance of the filter.
     * @param sampleRate the sample rate of the audio engine in Hz.
     */
    constructor(sampleRate: number);
    static initCache(sampleRate: number): void;
    init(): void;
    /**
     * Calculates the filter coefficients based on the current resonance and cutoff frequency and caches them.
     * @param cutoffCents The cutoff frequency in cents.
     */
    calculateCoefficients(cutoffCents: number): void;
}

/**
 * VOL ENV STATES:
 * 0 - delay
 * 1 - attack
 * 2 - hold/peak
 * 3 - decay
 * 4 - sustain
 * release indicates by isInRelease property
 */
type VolumeEnvelopeState = 0 | 1 | 2 | 3 | 4;
declare class VolumeEnvelope {
    /**
     * The sample rate in Hz.
     */
    readonly sampleRate: number;
    /**
     * The current attenuation of the envelope in cB.
     */
    attenuationCb: number;
    /**
     * The current stage of the volume envelope.
     */
    state: VolumeEnvelopeState;
    /**
     * The envelope's current time in samples.
     */
    private sampleTime;
    /**
     * The dB attenuation of the envelope when it entered the release stage.
     */
    private releaseStartCb;
    /**
     * The time in samples relative to the start of the envelope.
     */
    private releaseStartTimeSamples;
    /**
     * The attack duration in samples.
     */
    private attackDuration;
    /**
     * The decay duration in samples.
     */
    private decayDuration;
    /**
     * The release duration in samples.
     */
    private releaseDuration;
    /**
     * The voice's sustain amount in cB.
     */
    private sustainCb;
    /**
     * The time in samples to the end of delay stage, relative to the start of the envelope.
     */
    private delayEnd;
    /**
     * The time in samples to the end of attack stage, relative to the start of the envelope.
     */
    private attackEnd;
    /**
     * The time in samples to the end of hold stage, relative to the start of the envelope.
     */
    private holdEnd;
    /**
     * The time in samples to the end of decay stage, relative to the start of the envelope.
     */
    private decayEnd;
    /**
     * If the volume envelope has ever entered the release phase.
     * @private
     */
    private enteredRelease;
    /**
     * If sustain stage is silent,
     * then we can turn off the voice when it is silent.
     * We can't do that with modulated as it can silence the volume and then raise it again, and the voice must keep playing.
     */
    private canEndOnSilentSustain;
    private readonly gainSmoothing;
    private currentGain;
    /**
     * @param sampleRate Hz
     */
    constructor(sampleRate: number);
    /**
     * Applies volume envelope gain to the given output buffer.
     * Essentially we use approach of 100dB is silence, 0dB is peak.
     * @param sampleCount the amount of samples to write
     * @param buffer the audio buffer to modify
     * @param gainTarget the gain target to smooth.
     * @returns if the voice is still active
     */
    process(sampleCount: number, buffer: Float32Array, gainTarget: number): boolean;
    /**
     * Starts the release phase in the envelope.
     * @param voice the voice this envelope belongs to.
     */
    startRelease(voice: Voice): void;
    /**
     * Initialize the volume envelope
     * @param voice The voice this envelope belongs to
     */
    init(voice: Voice): void;
    private timecentsToSamples;
    private releasePhase;
    private delayPhase;
    private attackPhase;
    private holdPhase;
    private decayPhase;
    private sustainPhase;
}

declare class ModulationEnvelope {
    /**
     * The attack duration, in seconds.
     */
    private attackDuration;
    /**
     * The decay duration, in seconds.
     */
    private decayDuration;
    /**
     * The hold duration, in seconds.
     */
    private holdDuration;
    /**
     * Release duration, in seconds.
     */
    private releaseDuration;
    /**
     * The sustain level 0-1.
     */
    private sustainLevel;
    /**
     * Delay phase end time in seconds, absolute (audio context time).
     */
    private delayEnd;
    /**
     * Attack phase end time in seconds, absolute (audio context time).
     */
    private attackEnd;
    /**
     * Hold phase end time in seconds, absolute (audio context time).
     */
    private holdEnd;
    /**
     * The level of the envelope when the release phase starts.
     */
    private releaseStartLevel;
    /**
     * The current modulation envelope value.
     */
    private currentValue;
    /**
     * If the modulation envelope has ever entered the release phase.
     */
    private enteredRelease;
    /**
     * Decay phase end time in seconds, absolute (audio context time).
     */
    private decayEnd;
    /**
     * Calculates the current modulation envelope value for the given time and voice.
     * @param voice the voice we are working on.
     * @param currentTime in seconds.
     * @returns  mod env value, from 0 to 1.
     */
    process(voice: Voice, currentTime: number): number;
    /**
     * Starts the release phase in the envelope.
     * @param voice the voice this envelope belongs to.
     */
    startRelease(voice: Voice): void;
    /**
     * Initializes the modulation envelope.
     * @param voice the voice this envelope belongs to.
     */
    init(voice: Voice): void;
    private tc2Sec;
}

declare const interpolationTypes: {
    readonly linear: 0;
    readonly nearestNeighbor: 1;
    readonly hermite: 2;
};
type InterpolationType = (typeof interpolationTypes)[keyof typeof interpolationTypes];
declare const dataEntryStates: {
    readonly Idle: 0;
    readonly RPCoarse: 1;
    readonly RPFine: 2;
    readonly NRPCoarse: 3;
    readonly NRPFine: 4;
    readonly DataCoarse: 5;
    readonly DataFine: 6;
};
type DataEntryState = (typeof dataEntryStates)[keyof typeof dataEntryStates];
declare const customControllers: {
    /**
     * Cents, RPN for fine-tuning
     */
    readonly channelTuning: 0;
    /**
     * Cents, only the decimal tuning, (e.g., transpose is 4.5,
     * Then shift by 4 keys + tune by 50 cents)
     */
    readonly channelTransposeFine: 1;
    /**
     * The MIDI specification assumes the default modulation depth is 50 cents,
     * but it may vary for different sound banks.
     * For example, if you want a modulation depth of 100 cents,
     * the multiplier will be 2,
     * which, for a preset with a depth of 50,
     * will create a total modulation depth of 100 cents.
     */
    readonly modulationMultiplier: 2;
    /**
     * Cents, set by system exclusive
     */
    readonly masterTuning: 3;
    /**
     * Semitones, for RPN coarse tuning
     */
    readonly channelTuningSemitones: 4;
    /**
     * Key shift: for system exclusive
     */
    readonly channelKeyShift: 5;
    /**
     * Sf2 NPRN LSB for selecting a generator value
     */
    readonly sf2NPRNGeneratorLSB: 6;
};
type CustomController = (typeof customControllers)[keyof typeof customControllers];

interface MIDIPatch {
    /**
     * The MIDI program number.
     */
    program: number;
    /**
     * The MIDI bank MSB number.
     */
    bankMSB: number;
    /**
     * The MIDI bank LSB number.
     */
    bankLSB: number;
    /**
     * If the preset is marked as GM/GS drum preset. Note that XG drums do not have this flag.
     */
    isGMGSDrum: boolean;
}
interface MIDIPatchNamed extends MIDIPatch {
    /**
     * The name of the patch.
     */
    name: string;
}
declare class MIDIPatchTools {
    /**
     * Converts a MIDI patch to a string.
     */
    static toMIDIString(patch: MIDIPatch): string;
    /**
     * Gets a MIDI patch from a string.
     * @param string
     */
    static fromMIDIString(string: string): MIDIPatch;
    /**
     * Converts a named MIDI patch to string.
     * @param patch
     */
    static toNamedMIDIString(patch: MIDIPatchNamed): string;
    /**
     * Checks if two MIDI patches match.
     * @param patch1
     * @param patch2
     */
    static matches(patch1: MIDIPatch, patch2: MIDIPatch): boolean;
    /**
     * Gets a named MIDI patch from a string.
     * @param string
     */
    static fromNamedMIDIString(string: string): MIDIPatchNamed;
    static sorter(a: MIDIPatch, b: MIDIPatch): number;
}

declare class Generator {
    /**
     * The generator's SF2 type.
     */
    generatorType: GeneratorType;
    /**
     * The generator's 16-bit value.
     */
    generatorValue: number;
    /**
     * Constructs a new generator
     * @param type generator type
     * @param value generator value
     * @param validate if the limits should be validated and clamped.
     */
    constructor(type: GeneratorType, value: number, validate?: boolean);
    write(genData: IndexedByteArray): void;
    toString(): string;
}

declare class BasicZone {
    /**
     * The zone's velocity range.
     * min -1 means that it is a default value
     */
    velRange: GenericRange;
    /**
     * The zone's key range.
     * min -1 means that it is a default value.
     */
    keyRange: GenericRange;
    /**
     * The zone's generators.
     */
    generators: Generator[];
    /**
     * The zone's modulators.
     */
    modulators: Modulator[];
    get hasKeyRange(): boolean;
    get hasVelRange(): boolean;
    /**
     * The current tuning in cents, taking in both coarse and fine generators.
     */
    get fineTuning(): number;
    /**
     * The current tuning in cents, taking in both coarse and fine generators.
     */
    set fineTuning(tuningCents: number);
    /**
     * Adds to a given generator, or its default value.
     * @param type the generator type.
     * @param value the value to add.
     * @param validate if the value should be clamped to allowed limits.
     */
    addToGenerator(type: GeneratorType, value: number, validate?: boolean): void;
    /**
     * Sets a generator to a given value if preset, otherwise adds a new one.
     * @param type the generator type.
     * @param value the value to set. Set to null to remove this generator (set as "unset").
     * @param validate if the value should be clamped to allowed limits.
     */
    setGenerator(type: GeneratorType, value: number | null, validate?: boolean): void;
    /**
     * Adds generators to the zone.
     * @param generators the generators to add.
     */
    addGenerators(...generators: Generator[]): void;
    /**
     * Adds modulators to the zone.
     * @param modulators the modulators to add.
     */
    addModulators(...modulators: Modulator[]): void;
    /**
     * Gets a generator value.
     * @param generatorType the generator type.
     * @param notFoundValue if the generator is not found, this value is returned. A default value can be passed here, or null for example,
     * to check if the generator is set.
     */
    getGenerator<K>(generatorType: GeneratorType, notFoundValue: number | K): number | K;
    copyFrom(zone: BasicZone): void;
    /**
     * Filters the generators and prepends the range generators.
     */
    getWriteGenerators(bank: BasicSoundBank): Generator[];
}

declare class BasicGlobalZone extends BasicZone {
}

declare class BasicInstrumentZone extends BasicZone {
    /**
     * The instrument this zone belongs to.
     */
    readonly parentInstrument: BasicInstrument;
    /**
     * For tracking on the individual zone level, since multiple presets can refer to the same instrument.
     */
    useCount: number;
    /**
     * Creates a new instrument zone.
     * @param instrument The parent instrument.
     * @param sample The sample to use in this zone.
     */
    constructor(instrument: BasicInstrument, sample: BasicSample);
    /**
     * Zone's sample.
     */
    private _sample;
    /**
     * Zone's sample.
     */
    get sample(): BasicSample;
    /**
     * Sets a sample for this zone.
     * @param sample the sample to set.
     */
    set sample(sample: BasicSample);
    getWriteGenerators(bank: BasicSoundBank): Generator[];
}

declare class BasicPresetZone extends BasicZone {
    /**
     * The preset this zone belongs to.
     */
    readonly parentPreset: BasicPreset;
    /**
     * Creates a new preset zone.
     * @param preset the preset this zone belongs to.
     * @param instrument the instrument to use in this zone.
     */
    constructor(preset: BasicPreset, instrument: BasicInstrument);
    /**
     * Zone's instrument.
     */
    private _instrument;
    /**
     * Zone's instrument.
     */
    get instrument(): BasicInstrument;
    /**
     * Zone's instrument.
     */
    set instrument(instrument: BasicInstrument);
    getWriteGenerators(bank: BasicSoundBank): Generator[];
}

/**
 * Returned structure containing extended SF2 chunks.
 */
interface ExtendedSF2Chunks {
    /**
     * The PDTA part of the chunk.
     */
    pdta: IndexedByteArray;
    /**
     * The XDTA (https://github.com/spessasus/soundfont-proposals/blob/main/extended_limits.md) part of the chunk.
     */
    xdta: IndexedByteArray;
}
/**
 * Write indexes for tracking writing a SoundFont file.
 */
interface SoundFontWriteIndexes {
    /**
     * Generator start index.
     */
    gen: number;
    /**
     * Modulator start index.
     */
    mod: number;
    /**
     * Zone start index.
     */
    bag: number;
    /**
     * Preset/instrument start index.
     */
    hdr: number;
}

declare class BasicPreset implements MIDIPatchNamed {
    /**
     * The parent soundbank instance
     * Currently used for determining default modulators and XG status
     */
    readonly parentSoundBank: BasicSoundBank;
    /**
     * The preset's name
     */
    name: string;
    program: number;
    bankMSB: number;
    bankLSB: number;
    isGMGSDrum: boolean;
    /**
     * The preset's zones
     */
    zones: BasicPresetZone[];
    /**
     * Preset's global zone
     */
    readonly globalZone: BasicGlobalZone;
    /**
     * Unused metadata
     */
    library: number;
    /**
     * Unused metadata
     */
    genre: number;
    /**
     * Unused metadata
     */
    morphology: number;
    /**
     * Creates a new preset representation.
     * @param parentSoundBank the sound bank this preset belongs to.
     * @param globalZone optional, a global zone to use.
     */
    constructor(parentSoundBank: BasicSoundBank, globalZone?: BasicGlobalZone);
    get isXGDrums(): boolean;
    /**
     * Checks if this preset is a drum preset
     */
    get isAnyDrums(): boolean;
    private static isInRange;
    private static addUniqueModulators;
    private static subtractRanges;
    /**
     * Unlinks everything from this preset.
     */
    delete(): void;
    /**
     * Deletes an instrument zone from this preset.
     * @param index the zone's index to delete.
     */
    deleteZone(index: number): void;
    /**
     * Creates a new preset zone and returns it.
     * @param instrument the instrument to use in the zone.
     */
    createZone(instrument: BasicInstrument): BasicPresetZone;
    /**
     * Preloads (loads and caches synthesis data) for a given key range.
     */
    preload(keyMin: number, keyMax: number): void;
    /**
     * Checks if the bank and program numbers are the same for the given preset as this one.
     * @param preset The preset to check.
     */
    matches(preset: MIDIPatch): boolean;
    /**
     * Returns the voice synthesis data for this preset.
     * @param midiNote the MIDI note number.
     * @param velocity the MIDI velocity.
     * @returns the returned sound data.
     */
    getVoiceParameters(midiNote: number, velocity: number): VoiceParameters[];
    /**
     * BankMSB:bankLSB:program:isGMGSDrum
     */
    toMIDIString(): string;
    toString(): string;
    /**
     * Combines preset into an instrument, flattening the preset zones into instrument zones.
     * This is a really complex function that attempts to work around the DLS limitations of only having the instrument layer.
     * @returns The instrument containing the flattened zones. In theory, it should exactly the same as this preset.
     */
    toFlattenedInstrument(): BasicInstrument;
    /**
     * Writes the SF2 header
     * @param phdrData
     * @param index
     */
    write(phdrData: ExtendedSF2Chunks, index: number): void;
}

/**
 * Represents a single instrument
 */
declare class BasicInstrument {
    /**
     * The instrument's name
     */
    name: string;
    /**
     * The instrument's zones
     */
    zones: BasicInstrumentZone[];
    /**
     * Instrument's global zone
     */
    readonly globalZone: BasicGlobalZone;
    /**
     * Instrument's linked presets (the presets that use it)
     * note that duplicates are allowed since one preset can use the same instrument multiple times.
     */
    readonly linkedTo: BasicPreset[];
    /**
     * How many presets is this instrument used by
     */
    get useCount(): number;
    /**
     * Creates a new instrument zone and returns it.
     * @param sample The sample to use in the zone.
     */
    createZone(sample: BasicSample): BasicInstrumentZone;
    /**
     * Links the instrument ta a given preset
     * @param preset the preset to link to
     */
    linkTo(preset: BasicPreset): void;
    /**
     * Unlinks the instrument from a given preset
     * @param preset the preset to unlink from
     */
    unlinkFrom(preset: BasicPreset): void;
    deleteUnusedZones(): void;
    delete(): void;
    /**
     * Deletes a given instrument zone if it has no uses
     * @param index the index of the zone to delete
     * @param force ignores the use count and deletes forcibly
     * @returns if the zone has been deleted
     */
    deleteZone(index: number, force?: boolean): boolean;
    /**
     * Globalizes the instrument *in-place.*
     * This means trying to move as many generators and modulators
     * to the global zone as possible to reduce clutter and the count of parameters.
     */
    globalize(): void;
    write(instData: ExtendedSF2Chunks, index: number): void;
}

declare class BasicSample {
    /**
     * The sample's name.
     */
    name: string;
    /**
     * Sample rate in Hz.
     */
    sampleRate: number;
    /**
     * Original pitch of the sample as a MIDI note number.
     */
    originalKey: number;
    /**
     * Pitch correction, in cents. Can be negative.
     */
    pitchCorrection: number;
    /**
     * Linked sample, unused if mono.
     */
    linkedSample?: BasicSample;
    /**
     * The type of the sample.
     */
    sampleType: SampleType;
    /**
     * Relative to the start of the sample in sample points.
     */
    loopStart: number;
    /**
     * Relative to the start of the sample in sample points.
     */
    loopEnd: number;
    /**
     * Sample's linked instruments (the instruments that use it)
     * note that duplicates are allowed since one instrument can use the same sample multiple times.
     */
    linkedTo: BasicInstrument[];
    /**
     * Indicates if the data was overridden, so it cannot be copied back unchanged.
     */
    protected dataOverridden: boolean;
    /**
     * The compressed sample data if the sample has been compressed.
     */
    protected compressedData?: Uint8Array;
    /**
     * The sample's audio data.
     */
    protected audioData?: Float32Array;
    /**
     * The basic representation of a sample
     * @param sampleName The sample's name
     * @param sampleRate The sample's rate in Hz
     * @param originalKey The sample's pitch as a MIDI note number
     * @param pitchCorrection The sample's pitch correction in cents
     * @param sampleType The sample's type, an enum that can indicate SF3
     * @param loopStart The sample's loop start relative to the sample start in sample points
     * @param loopEnd The sample's loop end relative to the sample start in sample points
     */
    constructor(sampleName: string, sampleRate: number, originalKey: number, pitchCorrection: number, sampleType: SampleType, loopStart: number, loopEnd: number);
    /**
     * Indicates if the sample is compressed using vorbis SF3.
     */
    get isCompressed(): boolean;
    /**
     * If the sample is linked to another sample.
     */
    get isLinked(): boolean;
    /**
     * The sample's use count
     */
    get useCount(): number;
    /**
     * Get raw data for writing the file, either a compressed bit stream or signed 16-bit little endian PCM data.
     * @param allowVorbis if vorbis file data is allowed.
     * @return either s16le or vorbis data.
     */
    getRawData(allowVorbis: boolean): Uint8Array;
    /**
     * Resamples the audio data to a given sample rate.
     */
    resampleData(newSampleRate: number): void;
    /**
     * Compresses the audio data
     * @param encodeVorbis the compression function to use when compressing
     */
    compressSample(encodeVorbis: SampleEncodingFunction): Promise<void>;
    /**
     * Sets the sample type and unlinks if needed.
     * @param type The type to set it to.
     */
    setSampleType(type: SampleType): void;
    /**
     * Unlinks the sample from its stereo link if it has any.
     */
    unlinkSample(): void;
    /**
     * Links a stereo sample.
     * @param sample the sample to link to.
     * @param type either left, right or linked.
     */
    setLinkedSample(sample: BasicSample, type: SampleType): void;
    /**
     * Links the sample to a given instrument
     * @param instrument the instrument to link to
     */
    linkTo(instrument: BasicInstrument): void;
    /**
     * Unlinks the sample from a given instrument
     * @param instrument the instrument to unlink from
     */
    unlinkFrom(instrument: BasicInstrument): void;
    /**
     * Get the float32 audio data.
     * Note that this either decodes the compressed data or passes the ready sampleData.
     * If neither are set then it will throw an error!
     * @returns the audio data
     */
    getAudioData(): Float32Array;
    /**
     * Replaces the audio data *in-place*.
     * @param audioData The new audio data as Float32.
     * @param sampleRate The new sample rate, in Hertz.
     */
    setAudioData(audioData: Float32Array, sampleRate: number): void;
    /**
     * Replaces the audio with a compressed data sample and flags the sample as compressed
     * @param data the new compressed data
     */
    setCompressedData(data: Uint8Array): void;
    /**
     * Encodes s16le sample
     * @return the encoded data
     */
    protected encodeS16LE(): IndexedByteArray;
    /**
     * Decode binary vorbis into a float32 pcm
     */
    protected decodeVorbis(): Float32Array;
}
declare class EmptySample extends BasicSample {
    /**
     * A simplified class for creating samples.
     */
    constructor();
}

declare class SoundBankLoader {
    /**
     * Loads a sound bank from a file buffer.
     * @param buffer The binary file buffer to load.
     * @returns The loaded sound bank, a BasicSoundBank instance.
     */
    static fromArrayBuffer(buffer: ArrayBuffer): BasicSoundBank;
    private static loadDLS;
}

declare class VoiceModulator extends Modulator {
    /**
     * Indicates if the given modulator is chorus or reverb effects modulator.
     * This is done to simulate BASSMIDI effects behavior:
     * - defaults to 1000 transform amount rather than 200
     * - values can be changed, but anything above 200 is 1000
     * (except for values above 1000, they are copied directly)
     * - all values below are multiplied by 5 (200 * 5 = 1000)
     * - still can be disabled if the soundfont has its own modulator curve
     * - this fixes the very low amount of reverb by default and doesn't break soundfonts
     */
    readonly isEffectModulator: boolean;
    /**
     * The default resonant modulator does not affect the filter gain.
     * Neither XG nor GS responded to cc #74 in that way.
     */
    readonly isDefaultResonantModulator: boolean;
    /**
     * If this is a modulation wheel modulator (for modulation depth range).
     */
    readonly isModWheelModulator: boolean;
    private constructor();
    static fromData(s1: ModulatorSource, s2: ModulatorSource, destination: GeneratorType, amount: number, transformType: ModulatorTransformType): VoiceModulator;
    static fromModulator(mod: Modulator): VoiceModulator;
}

/**
 * Represents a cached voice
 */
declare class CachedVoice {
    /**
     * Sample data of this voice.
     */
    readonly sampleData: Float32Array;
    /**
     * The unmodulated (copied to) generators of the voice.
     */
    readonly generators: Int16Array;
    /**
     * The voice's modulators.
     */
    readonly modulators: VoiceModulator[];
    /**
     * Exclusive class number for hi-hats etc.
     */
    readonly exclusiveClass: number;
    /**
     * Target key of the voice (can be overridden by generators)
     */
    readonly targetKey: number;
    /**
     * Target velocity of the voice (can be overridden by generators)
     */
    readonly velocity: number;
    /**
     * MIDI root key of the sample
     */
    readonly rootKey: number;
    /**
     * Start position of the loop
     */
    readonly loopStart: number;
    /**
     * End position of the loop
     */
    readonly loopEnd: number;
    /**
     * Playback step (rate) for sample pitch correction
     */
    readonly playbackStep: number;
    readonly loopingMode: SampleLoopingMode;
    constructor(voiceParams: VoiceParameters, midiNote: number, velocity: number, sampleRate: number);
}

declare const midiMessageTypes: {
    readonly noteOff: 128;
    readonly noteOn: 144;
    readonly polyPressure: 160;
    readonly controllerChange: 176;
    readonly programChange: 192;
    readonly channelPressure: 208;
    readonly pitchWheel: 224;
    readonly systemExclusive: 240;
    readonly timecode: 241;
    readonly songPosition: 242;
    readonly songSelect: 243;
    readonly tuneRequest: 246;
    readonly clock: 248;
    readonly start: 250;
    readonly continue: 251;
    readonly stop: 252;
    readonly activeSensing: 254;
    readonly reset: 255;
    readonly sequenceNumber: 0;
    readonly text: 1;
    readonly copyright: 2;
    readonly trackName: 3;
    readonly instrumentName: 4;
    readonly lyric: 5;
    readonly marker: 6;
    readonly cuePoint: 7;
    readonly programName: 8;
    readonly midiChannelPrefix: 32;
    readonly midiPort: 33;
    readonly endOfTrack: 47;
    readonly setTempo: 81;
    readonly smpteOffset: 84;
    readonly timeSignature: 88;
    readonly keySignature: 89;
    readonly sequenceSpecific: 127;
};
type MIDIMessageType = (typeof midiMessageTypes)[keyof typeof midiMessageTypes];
declare const midiControllers: {
    readonly bankSelect: 0;
    readonly modulationWheel: 1;
    readonly breathController: 2;
    readonly undefinedCC3: 3;
    readonly footController: 4;
    readonly portamentoTime: 5;
    readonly dataEntryMSB: 6;
    readonly mainVolume: 7;
    readonly balance: 8;
    readonly undefinedCC9: 9;
    readonly pan: 10;
    readonly expressionController: 11;
    readonly effectControl1: 12;
    readonly effectControl2: 13;
    readonly undefinedCC14: 14;
    readonly undefinedCC15: 15;
    readonly generalPurposeController1: 16;
    readonly generalPurposeController2: 17;
    readonly generalPurposeController3: 18;
    readonly generalPurposeController4: 19;
    readonly undefinedCC20: 20;
    readonly undefinedCC21: 21;
    readonly undefinedCC22: 22;
    readonly undefinedCC23: 23;
    readonly undefinedCC24: 24;
    readonly undefinedCC25: 25;
    readonly undefinedCC26: 26;
    readonly undefinedCC27: 27;
    readonly undefinedCC28: 28;
    readonly undefinedCC29: 29;
    readonly undefinedCC30: 30;
    readonly undefinedCC31: 31;
    readonly bankSelectLSB: 32;
    readonly modulationWheelLSB: 33;
    readonly breathControllerLSB: 34;
    readonly undefinedCC3LSB: 35;
    readonly footControllerLSB: 36;
    readonly portamentoTimeLSB: 37;
    readonly dataEntryLSB: 38;
    readonly mainVolumeLSB: 39;
    readonly balanceLSB: 40;
    readonly undefinedCC9LSB: 41;
    readonly panLSB: 42;
    readonly expressionControllerLSB: 43;
    readonly effectControl1LSB: 44;
    readonly effectControl2LSB: 45;
    readonly undefinedCC14LSB: 46;
    readonly undefinedCC15LSB: 47;
    readonly undefinedCC16LSB: 48;
    readonly undefinedCC17LSB: 49;
    readonly undefinedCC18LSB: 50;
    readonly undefinedCC19LSB: 51;
    readonly undefinedCC20LSB: 52;
    readonly undefinedCC21LSB: 53;
    readonly undefinedCC22LSB: 54;
    readonly undefinedCC23LSB: 55;
    readonly undefinedCC24LSB: 56;
    readonly undefinedCC25LSB: 57;
    readonly undefinedCC26LSB: 58;
    readonly undefinedCC27LSB: 59;
    readonly undefinedCC28LSB: 60;
    readonly undefinedCC29LSB: 61;
    readonly undefinedCC30LSB: 62;
    readonly undefinedCC31LSB: 63;
    readonly sustainPedal: 64;
    readonly portamentoOnOff: 65;
    readonly sostenutoPedal: 66;
    readonly softPedal: 67;
    readonly legatoFootswitch: 68;
    readonly hold2Pedal: 69;
    readonly soundVariation: 70;
    readonly filterResonance: 71;
    readonly releaseTime: 72;
    readonly attackTime: 73;
    readonly brightness: 74;
    readonly decayTime: 75;
    readonly vibratoRate: 76;
    readonly vibratoDepth: 77;
    readonly vibratoDelay: 78;
    readonly soundController10: 79;
    readonly generalPurposeController5: 80;
    readonly generalPurposeController6: 81;
    readonly generalPurposeController7: 82;
    readonly generalPurposeController8: 83;
    readonly portamentoControl: 84;
    readonly undefinedCC85: 85;
    readonly undefinedCC86: 86;
    readonly undefinedCC87: 87;
    readonly undefinedCC88: 88;
    readonly undefinedCC89: 89;
    readonly undefinedCC90: 90;
    readonly reverbDepth: 91;
    readonly tremoloDepth: 92;
    readonly chorusDepth: 93;
    readonly variationDepth: 94;
    readonly phaserDepth: 95;
    readonly dataIncrement: 96;
    readonly dataDecrement: 97;
    readonly nonRegisteredParameterLSB: 98;
    readonly nonRegisteredParameterMSB: 99;
    readonly registeredParameterLSB: 100;
    readonly registeredParameterMSB: 101;
    readonly undefinedCC102LSB: 102;
    readonly undefinedCC103LSB: 103;
    readonly undefinedCC104LSB: 104;
    readonly undefinedCC105LSB: 105;
    readonly undefinedCC106LSB: 106;
    readonly undefinedCC107LSB: 107;
    readonly undefinedCC108LSB: 108;
    readonly undefinedCC109LSB: 109;
    readonly undefinedCC110LSB: 110;
    readonly undefinedCC111LSB: 111;
    readonly undefinedCC112LSB: 112;
    readonly undefinedCC113LSB: 113;
    readonly undefinedCC114LSB: 114;
    readonly undefinedCC115LSB: 115;
    readonly undefinedCC116LSB: 116;
    readonly undefinedCC117LSB: 117;
    readonly undefinedCC118LSB: 118;
    readonly undefinedCC119LSB: 119;
    readonly allSoundOff: 120;
    readonly resetAllControllers: 121;
    readonly localControlOnOff: 122;
    readonly allNotesOff: 123;
    readonly omniModeOff: 124;
    readonly omniModeOn: 125;
    readonly monoModeOn: 126;
    readonly polyModeOn: 127;
};
type MIDIController = (typeof midiControllers)[keyof typeof midiControllers];

interface EffectProcessor {
    /**
     * 0-127
     * This parameter sets the amount of the effect sent to the effect output.
     */
    level: number;
    /**
     * 0-7
     * A low-pass filter can be applied to the sound coming into the effect to cut the high
     * frequency range. Higher values will cut more of the high frequencies, resulting in a
     * more mellow effect sound.
     */
    preLowpass: number;
}
interface ReverbProcessorSnapshot extends EffectProcessor {
    /**
     * 0-7.
     * If character is not available, it should default to the first one.
     *
     * This parameter selects the type of reverb. 0–5 are reverb effects, and 6 and 7 are delay
     * effects.
     */
    character: number;
    /**
     * 0-127
     * This parameter sets the time over which the reverberation will continue.
     * Higher values result in longer reverberation.
     */
    time: number;
    /**
     * 0-127
     * This parameter is used when the Reverb Character is set to 6 or 7, or the Reverb Type
     * is set to Delay or Panning Delay (Rev Character 6, 7). It sets the way in which delays
     * repeat. Higher values result in more delay repeats.
     */
    delayFeedback: number;
    /**
     * 0 - 127 (ms)
     * This parameter sets the delay time until the reverberant sound is heard.
     * Higher values result in a longer pre-delay time, simulating a larger reverberant space.
     */
    preDelayTime: number;
}
interface ReverbProcessor extends ReverbProcessorSnapshot {
    /**
     * Process the effect and ADDS it to the output.
     * @param input The input buffer to process. It always starts at index 0.
     * @param outputLeft The left output buffer.
     * @param outputRight The right output buffer.
     * @param startIndex The index to start mixing at into the output buffers.
     * @param sampleCount The amount of samples to mix.
     */
    process(input: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, startIndex: number, sampleCount: number): void;
    /**
     * Gets a synthesizer from this effect processor instance.
     */
    getSnapshot(): ReverbProcessorSnapshot;
}
interface ChorusProcessorSnapshot extends EffectProcessor {
    /**
     * 0-127
     * This parameter sets the level at which the chorus sound is re-input (fed back) into the
     * chorus. By using feedback, a denser chorus sound can be created.
     * Higher values result in a greater feedback level.
     */
    feedback: number;
    /**
     * 0-127
     * This parameter sets the delay time of the chorus effect.
     */
    delay: number;
    /**
     * 0-127
     * This parameter sets the speed (frequency) at which the chorus sound is modulated.
     * Higher values result in faster modulation.
     */
    rate: number;
    /**
     * 0-127
     * This parameter sets the depth at which the chorus sound is modulated.
     * Higher values result in deeper modulation.
     */
    depth: number;
    /**
     * 0-127
     * This parameter sets the amount of chorus sound that will be sent to the reverb.
     * Higher values result in more sound being sent.
     */
    sendLevelToReverb: number;
    /**
     * 0-127
     * This parameter sets the amount of chorus sound that will be sent to the delay.
     * Higher values result in more sound being sent.
     */
    sendLevelToDelay: number;
}
interface ChorusProcessor extends ChorusProcessorSnapshot {
    /**
     * Process the effect and ADDS it to the output.
     * @param input The input buffer to process. It always starts at index 0.
     * @param outputLeft The left output buffer.
     * @param outputRight The right output buffer.
     * @param outputReverb The mono input for reverb. It always starts at index 0.
     * @param outputDelay The mono input for delay. It always starts at index 0.
     * @param startIndex The index to start mixing at into the output buffers.
     * @param sampleCount The amount of samples to mix.
     */
    process(input: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, outputReverb: Float32Array, outputDelay: Float32Array, startIndex: number, sampleCount: number): void;
    /**
     * Gets a synthesizer from this effect processor instance.
     */
    getSnapshot(): ChorusProcessorSnapshot;
}
interface DelayProcessorSnapshot extends EffectProcessor {
    /**
     * 0-115
     * 0.1ms-340ms-1000ms
     * The delay effect has three delay times; center, left and
     * right (when listening in stereo). Delay Time Center sets the delay time of the delay
     * located at the center.
     * Refer to SC-8850 Owner's Manual p. 236 for the exact mapping of the values.
     */
    timeCenter: number;
    /**
     * 0-120
     * 4% - 500%
     * This parameter sets the delay time of the delay located at the left as a percentage of
     * the Delay Time Center (up to a max. of 1.0 s).
     * The resolution is 100/24(%).
     */
    timeRatioLeft: number;
    /**
     * 1-120
     * 4%-500%
     * This parameter sets the delay time of the delay located at the right as a percentage of
     * the Delay Time Center (up to a max. of 1.0 s).
     * The resolution is 100/24(%).
     */
    timeRatioRight: number;
    /**
     * 0-127
     * This parameter sets the volume of the central delay. Higher values result in a louder
     * center delay.
     */
    levelCenter: number;
    /**
     * 0-127
     * This parameter sets the volume of the left delay. Higher values result in a louder left
     * delay.
     */
    levelLeft: number;
    /**
     * 0-127
     * This parameter sets the volume of the right delay. Higher values result in a louder
     * right delay.
     */
    levelRight: number;
    /**
     * 0-127
     * (-64)-63
     * This parameter affects the number of times the delay will repeat. With a value of 0,
     * the delay will not repeat. With higher values there will be more repeats.
     * With negative (-) values, the center delay will be fed back with inverted phase.
     * Negative values are effective with short delay times.
     */
    feedback: number;
    /**
     * 0-127
     * This parameter sets the amount of delay sound that is sent to the reverb.
     * Higher values result in more sound being sent.
     */
    sendLevelToReverb: number;
}
interface DelayProcessor extends DelayProcessorSnapshot {
    /**
     * Process the effect and ADDS it to the output.
     * @param input The input buffer to process. It always starts at index 0.
     * @param outputLeft The left output buffer.
     * @param outputRight The right output buffer.
     * @param outputReverb The mono input for reverb. It always starts at index 0.
     * @param startIndex The index to start mixing at into the output buffers.
     * @param sampleCount The amount of samples to mix.
     */
    process(input: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, outputReverb: Float32Array, startIndex: number, sampleCount: number): void;
    /**
     * Gets a synthesizer from this effect processor instance.
     */
    getSnapshot(): DelayProcessorSnapshot;
}
interface InsertionProcessor {
    /**
     * The EFX type of this processor, stored as MSB << | LSB.
     * For example 0x30, 0x10 is 0x3010
     */
    readonly type: number;
    /**
     * 0-1 (floating point)
     * This parameter sets the amount of insertion sound that will be sent to the reverb.
     * Higher values result in more sound being sent.
     */
    sendLevelToReverb: number;
    /**
     * 0-1 (floating point)
     * This parameter sets the amount of insertion sound that will be sent to the chorus.
     * Higher values result in more sound being sent.
     */
    sendLevelToChorus: number;
    /**
     * 0-1 (floating point)
     * This parameter sets the amount of insertion sound that will be sent to the delay.
     * Higher values result in more sound being sent.
     */
    sendLevelToDelay: number;
    /**
     * Resets the params to their default values.
     * This does not need to reset send levels.
     */
    reset(): void;
    /**
     * Sets an EFX parameter.
     * @param parameter The parameter number (0x03-0x16).
     * @param value The new value (0-127).
     */
    setParameter(parameter: number, value: number): void;
    /**
     * Process the effect and ADDS it to the output.
     * @param inputLeft The left input buffer to process. It always starts at index 0.
     * @param inputRight The right input buffer to process. It always starts at index 0.
     * @param outputLeft The left output buffer.
     * @param outputRight The right output buffer.
     * @param outputReverb The mono input for reverb. It always starts at index 0.
     * @param outputChorus The mono input for chorus. It always starts at index 0.
     * @param outputDelay The mono input for delay. It always starts at index 0.
     * @param startIndex The index to start mixing at into the output buffers.
     * @param sampleCount The amount of samples to mix.
     */
    process(inputLeft: Float32Array, inputRight: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, outputReverb: Float32Array, outputChorus: Float32Array, outputDelay: Float32Array, startIndex: number, sampleCount: number): void;
}
interface InsertionProcessorSnapshot {
    type: number;
    /**
     * 20 parameters for the effect, 255 means "no change" + 3 effect sends (index 20, 21, 22)
     */
    params: Uint8Array;
    /**
     * A boolean list for channels that have the insertion effect enabled.
     */
    channels: boolean[];
}
type InsertionProcessorConstructor = new (sampleRate: number, maxBufferSize: number) => InsertionProcessor;

type SynthSystem = "gm" | "gm2" | "gs" | "xg";
interface NoteOnCallback {
    /** The MIDI note number. */
    midiNote: number;
    /** The MIDI channel number. */
    channel: number;
    /** The velocity of the note. */
    velocity: number;
}
interface NoteOffCallback {
    /** The MIDI note number. */
    midiNote: number;
    /** The MIDI channel number. */
    channel: number;
}
interface DrumChangeCallback {
    /** The MIDI channel number. */
    channel: number;
    /** Indicates if the channel is a drum channel. */
    isDrumChannel: boolean;
}
interface ProgramChangeCallback extends MIDIPatch {
    /** The MIDI channel number. */
    channel: number;
}
interface ControllerChangeCallback {
    /** The MIDI channel number. */
    channel: number;
    /** The controller number. */
    controllerNumber: MIDIController;
    /** The value of the controller. */
    controllerValue: number;
}
interface MuteChannelCallback {
    /** The MIDI channel number. */
    channel: number;
    /** Indicates if the channel is muted. */
    isMuted: boolean;
}
interface PresetListEntry extends MIDIPatchNamed {
    /**
     * Indicates if this preset is any kind of drum preset.
     */
    isAnyDrums: boolean;
}
/**
 * A list of preset changes, each with a name, bank, and program number.
 */
type PresetList = PresetListEntry[];
/**
 * The synthesizer display system exclusive data, EXCLUDING THE F0 BYTE!
 */
type SynthDisplayCallback = number[];
interface PitchWheelCallback {
    /** The MIDI channel number. */
    channel: number;
    /**
     * The unsigned 14-bit value of the pitch: 0 - 16383.
     */
    pitch: number;
    /**
     * If the pitch wheel was note-specific, this is the MIDI note number that was altered. Set to -1 otherwise.
     */
    midiNote: number;
}
interface ChannelPressureCallback {
    /** The MIDI channel number. */
    channel: number;
    /** The pressure value. */
    pressure: number;
}
interface PolyPressureCallback {
    /** The MIDI channel number. */
    channel: number;
    /** The MIDI note number. */
    midiNote: number;
    /** The pressure value. */
    pressure: number;
}
/**
 * The error message for sound bank errors.
 */
type SoundBankErrorCallback = Error;
interface StopAllCallback {
    /**
     * The MIDI channel number.
     */
    channel: number;
    /**
     * If the channel was force stopped. (no release time)
     */
    force: boolean;
}
type MasterParameterChangeCallback = {
    [P in keyof MasterParameterType]: {
        /**
         * The parameter that was changed.
         */
        parameter: P;
        /**
         * The new value of this parameter.
         */
        value: MasterParameterType[P];
    };
}[keyof MasterParameterType];
interface ChannelPropertyChangeCallback {
    /**
     * The channel number of the new property.
     */
    channel: number;
    /**
     * The updated property.
     */
    property: ChannelProperty;
}
type FXType<K> = Exclude<keyof K, "process" | "getSnapshot"> | "macro";
type EffectChangeCallback = {
    /**
     * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
     */
    effect: "reverb";
    /**
     * The parameter type or "macro".
     */
    parameter: FXType<ReverbProcessor>;
    /**
     * The new 7-bit value.
     */
    value: number;
} | {
    /**
     * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
     */
    effect: "chorus";
    /**
     * The parameter type or "macro".
     */
    parameter: FXType<ChorusProcessor>;
    /**
     * The new 7-bit value.
     */
    value: number;
} | {
    /**
     * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
     */
    effect: "delay";
    /**
     * The parameter type or "macro".
     */
    parameter: FXType<DelayProcessor>;
    /**
     * The new 7-bit value.
     */
    value: number;
} | {
    /**
     * The effect that was changed, "reverb", "chorus", "delay" or "insertion"
     */
    effect: "insertion";
    /**
     * The parameter that was changed. This maps to GS address map at addr2 = 0x03.
     * See SC-8850 Manual p.237,
     * for example:
     * - 0x0 - EFX type, the value is 16 bit in this special case. Note that this resets the parameters!
     * - 0x3 - EFX param 1
     * - 0x16 - EFX param 20 (usually level)
     * - 0x17 - EFX send to reverb
     *
     * There are two exceptions:
     * - -1 - the channel has ENABLED the effect.
     * - -2 - the channel has DISABLED the effect.
     * For both of these cases, `value` is the channel number.
     */
    parameter: number;
    /**
     * The new value for the parameter.
     */
    value: number;
};
interface SynthProcessorEventData {
    /**
     * This event fires when a note is played.
     */
    noteOn: NoteOnCallback;
    /**
     * This event fires when a note is released.
     */
    noteOff: NoteOffCallback;
    /**
     * This event fires when a pitch wheel is changed.
     */
    pitchWheel: PitchWheelCallback;
    /**
     * This event fires when a controller is changed.
     */
    controllerChange: ControllerChangeCallback;
    /**
     * This event fires when a program is changed.
     */
    programChange: ProgramChangeCallback;
    /**
     * This event fires when a channel pressure is changed.
     */
    channelPressure: ChannelPressureCallback;
    /**
     * This event fires when a polyphonic pressure is changed.
     */
    polyPressure: PolyPressureCallback;
    /**
     * This event fires when a drum channel is changed.
     */
    drumChange: DrumChangeCallback;
    /**
     * This event fires when all notes on a channel are stopped.
     */
    stopAll: StopAllCallback;
    /**
     * This event fires when a new channel is created. There is no data for this event.
     */
    newChannel: void;
    /**
     * This event fires when a channel is muted or unmuted.
     */
    muteChannel: MuteChannelCallback;
    /**
     * This event fires when the preset list is changed.
     */
    presetListChange: PresetList;
    /**
     * This event fires when all controllers on all channels are reset. There is no data for this event.
     */
    allControllerReset: void;
    /**
     * This event fires when a sound bank parsing error occurs.
     */
    soundBankError: SoundBankErrorCallback;
    /**
     * This event fires when the synthesizer receives a display message.
     */
    synthDisplay: SynthDisplayCallback;
    /**
     * This event fires when a master parameter changes.
     */
    masterParameterChange: MasterParameterChangeCallback;
    /**
     * This event fires when a channel property changes.
     */
    channelPropertyChange: ChannelPropertyChangeCallback;
    /**
     * This event fires when an effect processor is modified.
     */
    effectChange: EffectChangeCallback;
}
type SynthProcessorEvent = {
    [K in keyof SynthProcessorEventData]: {
        type: K;
        data: SynthProcessorEventData[K];
    };
}[keyof SynthProcessorEventData];
interface SynthMethodOptions {
    /**
     * The audio context time when the event should execute, in seconds.
     */
    time: number;
}
/**
 * Looping mode of the sample.
 * 0 - no loop.
 * 1 - loop.
 * 2 - UNOFFICIAL: polyphone 2.4 added start on release.
 * 3 - loop then play when released.
 */
type SampleLoopingMode = 0 | 1 | 2 | 3;
/**
 * A list of voices for a given key:velocity.
 */
type CachedVoiceList = CachedVoice[];
interface ChannelProperty {
    /**
     * The channel's current voice amount.
     */
    voicesAmount: number;
    /**
     * The channel's current pitch wheel 0 - 16384.
     */
    pitchWheel: number;
    /**
     * The pitch wheel's range, in semitones.
     */
    pitchWheelRange: number;
    /**
     * Indicates whether the channel is muted.
     */
    isMuted: boolean;
    /**
     * Indicates whether the channel is a drum channel.
     */
    isDrum: boolean;
    /**
     * Indicates whether the channel uses an insertion effect.
     * This means that there will be no separate dry output for processSplit().
     */
    isEFX: boolean;
    /**
     * The channel's transposition, in semitones.
     */
    transposition: number;
}
interface SynthProcessorOptions {
    /**
     * The maximum buffer size the synthesizer can render at once.
     * Attempting to `.process()` more samples than this will result in an error.
     * Defaults to 128.
     */
    maxBufferSize: number;
    /**
     * Indicates if the event system is enabled. This can be changed later.
     */
    enableEventSystem: boolean;
    /**
     * The initial time of the synth, in seconds.
     */
    initialTime: number;
    /**
     * Indicates if the effects are enabled. This can be changed later.
     */
    enableEffects: boolean;
    /**
     * Reverb processor for the synthesizer. Leave undefined to use the default.
     */
    reverbProcessor?: ReverbProcessor;
    /**
     * Chorus processor for the synthesizer. Leave undefined to use the default.
     */
    chorusProcessor?: ChorusProcessor;
    /**
     * Delay processor for the synthesizer. Leave undefined to use the default.
     */
    delayProcessor?: DelayProcessor;
}
/**
 * The master parameters of the synthesizer.
 */
interface MasterParameterType {
    /**
     * The master gain, from 0 to any number. 1 is 100% volume.
     */
    masterGain: number;
    /**
     * The master pan, from -1 (left) to 1 (right). 0 is center.
     */
    masterPan: number;
    /**
     * The maximum number of voices that can be played at once.
     *
     * @remarks
     * Increasing this value causes memory allocation for more voices.
     * It is recommended to set it at the beginning, before rendering audio to avoid GC.
     * Decreasing it does not cause memory usage change, so it's fine to use.
     */
    voiceCap: number;
    /**
     * Enabling this parameter will cause a new voice allocation when the voice cap is hit, rather than stealing existing voices.
     *
     * @remarks
     * This is not recommended in real-time environments.
     */
    autoAllocateVoices: boolean;
    /**
     * The interpolation type used for sample playback.
     */
    interpolationType: InterpolationType;
    /**
     * The MIDI system used by the synthesizer for bank selects and system exclusives. (GM, GM2, GS, XG)
     */
    midiSystem: SynthSystem;
    /**
     * Indicates whether the synthesizer is in monophonic retrigger mode.
     * This emulates the behavior of Microsoft GS Wavetable Synth,
     * Where a new note will kill the previous one if it is still playing.
     */
    monophonicRetriggerMode: boolean;
    /**
     * The reverb gain, from 0 to any number. 1 is 100% reverb.
     */
    reverbGain: number;
    /**
     * If the synthesizer should prevent editing of the reverb parameters.
     * This effect is modified using MIDI system exclusive messages, so
     * the recommended use case would be setting
     * the reverb parameters then locking it to prevent changes by MIDI files.
     */
    reverbLock: boolean;
    /**
     * The chorus gain, from 0 to any number. 1 is 100% chorus.
     */
    chorusGain: number;
    /**
     * If the synthesizer should prevent editing of the chorus parameters.
     * This effect is modified using MIDI system exclusive messages, so
     * the recommended use case would be setting
     * the chorus parameters then locking it to prevent changes by MIDI files.
     */
    chorusLock: boolean;
    /**
     * The delay gain, from 0 to any number. 1 is 100% delay.
     */
    delayGain: number;
    /**
     * If the synthesizer should prevent editing of the delay parameters.
     * This effect is modified using MIDI system exclusive messages, so
     * the recommended use case would be setting
     * the delay parameters then locking it to prevent changes by MIDI files.
     */
    delayLock: boolean;
    /**
     * If the synthesizer should prevent changing the insertion effect type and parameters (including enabling/disabling it on channels).
     * This effect is modified using MIDI system exclusive messages, so
     * the recommended use case would be setting
     * the insertion effect type and parameters then locking it to prevent changes by MIDI files.
     */
    insertionEffectLock: boolean;
    /**
     * If the synthesizer should prevent editing of the drum parameters.
     * These params are modified using MIDI system exclusive messages or NRPN, so
     * the recommended use case would be setting
     * the drum parameters then locking it to prevent changes by MIDI files.
     */
    drumLock: boolean;
    /**
     * If the synthesizer should prevent applying the custom vibrato.
     * This effect is modified using NRPN, so
     * the recommended use case would be setting
     * the custom vibrato then locking it to prevent changes by MIDI files.
     */
    customVibratoLock: boolean;
    /**
     * If the synthesizer should prevent changing any parameters via NRPN.
     * This includes the custom vibrato parameters.
     */
    nprnParamLock: boolean;
    /**
     * Forces note killing instead of releasing. Improves performance in black MIDIs.
     */
    blackMIDIMode: boolean;
    /**
     * The global transposition in semitones. It can be decimal to provide microtonal tuning.
     */
    transposition: number;
    /**
     * Synthesizer's device ID for system exclusive messages. Set to -1 to accept all.
     */
    deviceID: number;
}

/**
 * Wavetable_oscillator.ts
 * purpose: plays back raw audio data at an arbitrary playback rate
 */
declare abstract class WavetableOscillator {
    /**
     * Is the loop on?
     */
    isLooping: boolean;
    /**
     * Sample data of the voice.
     */
    sampleData?: Float32Array;
    /**
     * Playback step (rate) for sample pitch correction.
     */
    playbackStep: number;
    /**
     * Start position of the loop.
     */
    loopStart: number;
    /**
     * End position of the loop.
     */
    loopEnd: number;
    /**
     * Length of the loop.
     * @private
     */
    loopLength: number;
    /**
     * End position of the sample.
     */
    end: number;
    /**
     * The current cursor of the sample.
     */
    cursor: number;
    /**
     * Fills the output buffer with raw sample data using a given interpolation.
     * @param sampleCount The amount of samples to write into the buffer.
     * @param tuningRatio the tuning ratio to apply.
     * @param outputBuffer The output buffer to write to.
     */
    abstract process(sampleCount: number, tuningRatio: number, outputBuffer: Float32Array): boolean;
}

/**
 * Voice.ts
 * purpose: prepares Voices from sample and generator data
 */

/**
 * Voice represents a single instance of the
 * SoundFont2 synthesis model.
 * That is:
 * A wavetable oscillator (sample)
 * A volume envelope (volEnv)
 * A modulation envelope (modEnv)
 * Generators (generators and modulatedGenerators)
 * Modulators (modulators)
 * And MIDI params such as channel, MIDI note, velocity
 */
declare class Voice {
    /**
     * All oscillators currently available to the voice.
     */
    readonly oscillators: Record<InterpolationType, WavetableOscillator>;
    /**
     * The oscillator currently used by this voice.
     */
    wavetable: WavetableOscillator;
    /**
     * Lowpass filter applied to the voice.
     */
    readonly filter: LowpassFilter;
    /**
     * The unmodulated (copied to) generators of the voice.
     */
    readonly generators: Int16Array<ArrayBuffer>;
    /**
     * The generators in real-time, affected by modulators.
     * This is used during rendering.
     */
    readonly modulatedGenerators: Int16Array<ArrayBuffer>;
    /**
     * The voice's modulators.
     */
    modulators: VoiceModulator[];
    /**
     * The current values for the respective modulators.
     * If there are more modulators, the array must be resized.
     */
    modulatorValues: Int16Array<ArrayBuffer>;
    /**
     * Modulation envelope.
     */
    readonly modEnv: ModulationEnvelope;
    /**
     * Volume envelope.
     */
    readonly volEnv: VolumeEnvelope;
    /**
     * Resonance offset, it is affected by the default resonant modulator
     */
    resonanceOffset: number;
    /**
     * Priority of the voice. Used for stealing.
     */
    priority: number;
    /**
     * If the voice is currently active.
     * If not, it can be used.
     */
    isActive: boolean;
    /**
     * Indicates if the voice has rendered at least one buffer.
     * Used for exclusive class to prevent killing voices set on the same note.
     */
    hasRendered: boolean;
    /**
     * Indicates if the voice is in the release phase.
     */
    isInRelease: boolean;
    /**
     * Indicates if the voice is currently held by the sustain pedal.
     */
    isHeld: boolean;
    /**
     * MIDI channel number of the voice.
     */
    channel: number;
    /**
     * Velocity of the note.
     */
    velocity: number;
    /**
     * MIDI note number.
     */
    midiNote: number;
    /**
     * The root key of the voice.
     */
    rootKey: number;
    /**
     * Target key for the note.
     */
    targetKey: number;
    /**
     * The pressure of the voice
     */
    pressure: number;
    /**
     * Linear gain of the voice. Used with Key Modifiers.
     */
    gainModifier: number;
    /**
     * Looping mode of the sample:
     * 0 - no loop
     * 1 - loop
     * 2 - UNOFFICIAL: polyphone 2.4 added start on release
     * 3 - loop then play when released
     */
    loopingMode: SampleLoopingMode;
    /**
     * Start time of the voice, absolute.
     */
    startTime: number;
    /**
     * Start time of the release phase, absolute.
     */
    releaseStartTime: number;
    /**
     * Current tuning in cents.
     */
    tuningCents: number;
    /**
     * Current calculated tuning. (as in ratio)
     */
    tuningRatio: number;
    /**
     * From -500 to 500. Used for smoothing.
     */
    currentPan: number;
    /**
     * If MIDI Tuning Standard is already applied (at note-on time),
     * this will be used to take the values at real-time tuning as "midiNote"
     * property contains the tuned number.
     * see  SpessaSynth#29 comment by @paulikaro
     */
    realKey: number;
    /**
     * Initial key to glide from, MIDI Note number. If -1, the portamento is OFF.
     */
    portamentoFromKey: number;
    /**
     * Duration of the linear glide, in seconds.
     */
    portamentoDuration: number;
    /**
     * From -500 to 500, where zero means disabled (use the channel pan). Used for random pan.
     */
    overridePan: number;
    /**
     * In cents, used for drum tuning.
     */
    pitchOffset: number;
    /**
     * Reverb send of the voice, used for drum parts, otherwise 1.
     */
    reverbSend: number;
    /**
     * Chorus send of the voice, used for drum parts, otherwise 1.
     */
    chorusSend: number;
    /**
     * Delay send of the voice, used for drum parts, otherwise 1.
     */
    delaySend: number;
    /**
     * Exclusive class number for hi-hats etc.
     */
    exclusiveClass: number;
    /**
     * In timecents, where zero means disabled (use the modulatedGenerators table).
     * Used for exclusive notes and killing notes.
     */
    overrideReleaseVolEnv: number;
    vibLfoPhase: number;
    vibLfoStartTime: number;
    modLfoPhase: number;
    modLfoStartTime: number;
    constructor(sampleRate: number);
    /**
     * Releases the voice as exclusiveClass.
     */
    exclusiveRelease(currentTime: number, minExclusiveLength?: number): void;
    /**
     * Stops the voice
     * @param currentTime
     * @param minNoteLength minimum note length in seconds
     */
    releaseVoice(currentTime: number, minNoteLength?: number): void;
    setup(currentTime: number, channel: number, midiNote: number, velocity: number, realKey: number): void;
}

declare class ModulatorSource {
    /**
     * If this field is set to false, the controller should be mapped with a minimum value of 0 and a maximum value of 1. This is also
     * called Unipolar. Thus, it behaves similar to the Modulation Wheel controller of the MIDI specification.
     *
     * If this field is set to true, the controller sound be mapped with a minimum value of -1 and a maximum value of 1. This is also
     * called Bipolar. Thus, it behaves similar to the Pitch Wheel controller of the MIDI specification.
     */
    isBipolar: boolean;
    /**
     * If this field is set true, the direction of the controller should be from the maximum value to the minimum value. So, for
     * example, if the controller source is Key Number, then a Key Number value of 0 corresponds to the maximum possible
     * controller output, and the Key Number value of 127 corresponds to the minimum possible controller input.
     */
    isNegative: boolean;
    /**
     * The index of the source.
     * It can point to one of the MIDI controllers or one of the predefined sources, depending on the 'isCC' flag.
     */
    index: ModulatorSourceIndex;
    /**
     * If this field is set to true, the MIDI Controller Palette is selected. The ‘index’ field value corresponds to one of the 128
     * MIDI Continuous Controller messages as defined in the MIDI specification.
     */
    isCC: boolean;
    /**
     * This field specifies how the minimum value approaches the maximum value.
     */
    curveType: ModulatorCurveType;
    constructor(index?: ModulatorSourceIndex, curveType?: ModulatorCurveType, isCC?: boolean, isBipolar?: boolean, isNegative?: boolean);
    private get sourceName();
    private get curveTypeName();
    static fromSourceEnum(sourceEnum: number): ModulatorSource;
    /**
     * Copies the modulator source.
     * @param source The source to copy from.
     * @returns the copied source.
     */
    static copyFrom(source: ModulatorSource): ModulatorSource;
    toString(): string;
    toSourceEnum(): number;
    isIdentical(source: ModulatorSource): boolean;
    /**
     * Gets the current value from this source.
     * @param midiControllers The MIDI controller + modulator source array.
     * @param pitchWheel the pitch wheel value, as channel determines if it's a per-note or a global value.
     * @param voice The voice to get the data for.
     */
    getValue(midiControllers: Int16Array, pitchWheel: number, voice: Voice): number;
}

declare class Modulator {
    /**
     * The generator destination of this modulator.
     */
    destination: GeneratorType;
    /**
     * The transform amount for this modulator.
     */
    transformAmount: number;
    /**
     * The transform type for this modulator.
     */
    transformType: ModulatorTransformType;
    /**
     * The primary source of this modulator.
     */
    readonly primarySource: ModulatorSource;
    /**
     * The secondary source of this modulator.
     */
    readonly secondarySource: ModulatorSource;
    /**
     * Creates a new SF2 Modulator
     */
    constructor(primarySource?: ModulatorSource, secondarySource?: ModulatorSource, destination?: GeneratorType, amount?: number, transformType?: ModulatorTransformType);
    private get destinationName();
    /**
     * Checks if the pair of modulators is identical (in SF2 terms)
     * @param mod1 modulator 1
     * @param mod2 modulator 2
     * @param checkAmount if the amount should be checked too.
     * @returns if they are identical
     */
    static isIdentical(mod1: Modulator, mod2: Modulator, checkAmount?: boolean): boolean;
    /**
     * Copies a modulator.
     * @param mod The modulator to copy.
     * @returns The copied modulator.
     */
    static copyFrom(mod: Modulator): Modulator;
    toString(): string;
    write(modData: IndexedByteArray, indexes?: SoundFontWriteIndexes): void;
    /**
     * Sums transform and create a NEW modulator
     * @param modulator the modulator to sum with
     * @returns the new modulator
     */
    sumTransform(modulator: Modulator): Modulator;
}

/**
 * Midi_message.ts
 * purpose: contains enums for midi events and controllers and functions to parse them
 */

declare class MIDIMessage {
    /**
     * Absolute number of MIDI ticks from the start of the track.
     */
    ticks: number;
    /**
     * The MIDI message status byte. Note that for meta events, it is the second byte. (not 0xFF)
     */
    statusByte: MIDIMessageType;
    /**
     * Message's binary data
     */
    data: Uint8Array<ArrayBuffer>;
    /**
     * Creates a new MIDI message
     * @param ticks time of this message in absolute MIDI ticks
     * @param byte the message status byte
     * @param data the message's binary data
     */
    constructor(ticks: number, byte: MIDIMessageType, data: Uint8Array<ArrayBuffer>);
}

/**
 * RMIDInfoData type represents metadata for an RMIDI file.
 */
interface RMIDInfoData {
    /**
     * The name of the song.
     */
    name: string;
    /**
     * The engineer who worked on the sound bank file.
     */
    engineer: string;
    /**
     * The artist of the MIDI file.
     */
    artist: string;
    /**
     * The album of the song.
     */
    album: string;
    /**
     * The genre of the song.
     */
    genre: string;
    /**
     * The image for the file (album cover).
     */
    picture: ArrayBuffer;
    /**
     * The comment of the file.
     */
    comment: string;
    /**
     * The creation date of the file.
     */
    creationDate: Date;
    /**
     * The copyright of the file.
     */
    copyright: string;
    /**
     * The encoding of the RMIDI info.
     */
    infoEncoding: string;
    /**
     * The encoding of the MIDI file's text messages.
     */
    midiEncoding: string;
    /**
     * The software used to write the file.
     */
    software: string;
    /**
     * The subject of the file.
     */
    subject: string;
}
interface TempoChange {
    /**
     * MIDI ticks of the change, absolute value from the start of the MIDI file.
     */
    ticks: number;
    /**
     * New tempo in BPM.
     */
    tempo: number;
}
type MIDILoopType = "soft" | "hard";
interface MIDILoop {
    /**
     * Start of the loop, in MIDI ticks.
     */
    start: number;
    /**
     * End of the loop, in MIDI ticks.
     */
    end: number;
    /**
     * The type of the loop detected:
     * - Soft - the playback will immediately jump to the loop start pointer without any further processing.
     * - Hard - the playback will quickly process all messages from
     * the start of the file to ensure that synthesizer is in the correct state.
     * This is the default behavior.
     *
     * Soft loop types are enabled for Touhou and GameMaker loop points.
     */
    type: MIDILoopType;
}
type MIDIFormat = 0 | 1 | 2;
interface NoteTime {
    /**
     * The MIDI key number.
     */
    midiNote: number;
    /**
     * Start of the note, in seconds.
     */
    start: number;
    /**
     * Length of the note, in seconds.
     */
    length: number;
    /**
     * The MIDI velocity of the note.
     */
    velocity: number;
}
/**
 * Represents a desired program change for a MIDI channel.
 */
interface DesiredProgramChange extends MIDIPatch {
    /**
     * The channel number.
     */
    channel: number;
}
/**
 * Represents a desired controller change for a MIDI channel.
 */
interface DesiredControllerChange {
    /**
     * The channel number.
     */
    channel: number;
    /**
     * The MIDI controller number.
     */
    controllerNumber: number;
    /**
     * The new controller value.
     */
    controllerValue: number;
}
/**
 * Represents a desired channel transpose change.
 */
interface DesiredChannelTranspose {
    /**
     * The channel number.
     */
    channel: number;
    /**
     * The number of semitones to transpose.
     * This can use floating point numbers, which will be used to fine-tune the pitch in cents using RPN.
     */
    keyShift: number;
}
interface RMIDIWriteOptions {
    /**
     * The bank offset for RMIDI.
     */
    bankOffset: number;
    /**
     * The metadata of the file. Optional.
     */
    metadata: Partial<Omit<RMIDInfoData, "infoEncoding">>;
    /**
     * If the MIDI file should internally be corrected to work with the set bank offset.
     */
    correctBankOffset: boolean;
    /**
     * The optional sound bank instance used to correct bank offset.
     */
    soundBank?: BasicSoundBank;
}
type RMIDInfoFourCC = "INAM" | "IPRD" | "IALB" | "IART" | "IGNR" | "IPIC" | "ICOP" | "ICRD" | "ICRT" | "ICMT" | "IENG" | "ISFT" | "ISBJ" | "IENC" | "MENC" | "DBNK";

/**
 * A manager for custom key overrides for channels
 */

declare class KeyModifier {
    /**
     * The new override velocity. -1 means unchanged.
     */
    velocity: number;
    /**
     * The MIDI patch this key uses. -1 on any property means unchanged.
     */
    patch: MIDIPatch;
    /**
     * Linear gain override for the voice.
     */
    gain: number;
}
declare class KeyModifierManager {
    /**
     * The velocity override mappings for MIDI keys
     * stored as [channelNumber][midiNote].
     */
    private keyMappings;
    /**
     * Add a mapping for a MIDI key to a KeyModifier.
     * @param channel The MIDI channel number.
     * @param midiNote The MIDI note number (0-127).
     * @param mapping The KeyModifier to apply for this key.
     */
    addMapping(channel: number, midiNote: number, mapping: KeyModifier): void;
    /**
     * Delete a mapping for a MIDI key.
     * @param channel The MIDI channel number.
     * @param midiNote The MIDI note number (0-127).
     */
    deleteMapping(channel: number, midiNote: number): void;
    /**
     * Clear all key mappings.
     */
    clearMappings(): void;
    /**
     * Sets the key mappings to a new array.
     * @param mappings A 2D array where the first dimension is the channel number and the second dimension is the MIDI note number.
     */
    setMappings(mappings: (KeyModifier | undefined)[][]): void;
    /**
     * Returns the current key mappings.
     */
    getMappings(): (KeyModifier | undefined)[][];
    /**
     * Gets the velocity override for a MIDI key.
     * @param channel The MIDI channel number.
     * @param midiNote The MIDI note number (0-127).
     * @returns The velocity override, or -1 if no override is set.
     */
    getVelocity(channel: number, midiNote: number): number;
    /**
     * Gets the gain override for a MIDI key.
     * @param channel The MIDI channel number.
     * @param midiNote The MIDI note number (0-127).
     * @returns The gain override, or 1 if no override is set.
     */
    getGain(channel: number, midiNote: number): number;
    /**
     * Checks if a MIDI key has an override for the patch.
     * @param channel The MIDI channel number.
     * @param midiNote The MIDI note number (0-127).
     * @returns True if the key has an override patch, false otherwise.
     */
    hasOverridePatch(channel: number, midiNote: number): boolean;
    /**
     * Gets the patch override for a MIDI key.
     * @param channel The MIDI channel number.
     * @param midiNote The MIDI note number (0-127).
     * @returns An object containing the bank and program numbers.
     * @throws Error if no modifier is set for the key.
     */
    getPatch(channel: number, midiNote: number): MIDIPatch;
}

declare class SoundBankManager {
    /**
     * All the sound banks, ordered from the most important to the least.
     */
    soundBankList: SoundBankManagerListEntry[];
    private readonly presetListChangeCallback;
    private selectablePresetList;
    /**
     * @param presetListChangeCallback Supplied by the parent synthesizer class,
     * this is called whenever the preset list changes.
     */
    constructor(presetListChangeCallback: () => unknown);
    private _presetList;
    /**
     * The list of all presets in the sound bank stack.
     */
    get presetList(): PresetListEntry[];
    /**
     * The current sound bank priority order.
     * @returns The IDs of the sound banks in the current order.
     */
    get priorityOrder(): string[];
    /**
     * The current sound bank priority order.
     * @param newList The new order of sound bank IDs.
     */
    set priorityOrder(newList: string[]);
    /**
     * Deletes a given sound bank by its ID.
     * @param id the ID of the sound bank to delete.
     */
    deleteSoundBank(id: string): void;
    /**
     * Adds a new sound bank with a given ID, or replaces an existing one.
     * @param font the sound bank to add.
     * @param id the ID of the sound bank.
     * @param bankOffset the bank offset of the sound bank.
     */
    addSoundBank(font: BasicSoundBank, id: string, bankOffset?: number): void;
    /**
     * Gets a given preset from the sound bank stack.
     * @param patch The MIDI patch to search for.
     * @param system The MIDI system to select the preset for.
     * @returns An object containing the preset and its bank offset.
     */
    getPreset(patch: MIDIPatch, system: SynthSystem): BasicPreset | undefined;
    destroy(): void;
    private generatePresetList;
}

/**
 * Reset all controllers for channel.
 * This will reset all controllers to their default values,
 * except for the locked controllers.
 */
declare function resetControllers(this: MIDIChannel, sendCCEvents?: boolean): void;
declare function resetPreset(this: MIDIChannel): void;
/**
 * https://amei.or.jp/midistandardcommittee/Recommended_Practice/e/rp15.pdf
 * Reset controllers according to RP-15 Recommended Practice.
 */
declare function resetControllersRP15Compliant(this: MIDIChannel): void;
/**
 * Reset all parameters to their default values.
 * This includes NRPN and RPN controllers, data entry state,
 * and generator overrides and offsets.
 */
declare function resetParameters(this: MIDIChannel): void;

/**
 * Executes a data entry fine (LSB) change for the current channel.
 * @param dataValue The value to set for the data entry fine controller (0-127).
 */
declare function dataEntryFine(this: MIDIChannel, dataValue: number): void;

/**
 * Handles MIDI controller changes for a channel.
 * @param controllerNumber The MIDI controller number (0-127).
 * @param controllerValue The value of the controller (0-127).
 * @param sendEvent If an event should be emitted.
 * @remarks
 * This function processes MIDI controller changes, updating the channel's
 * midiControllers table and handling special cases like bank select,
 * data entry, and sustain pedal. It also computes modulators for all voices
 * in the channel based on the controller change.
 * to allow changes.
 */
declare function controllerChange(this: MIDIChannel, controllerNumber: MIDIController, controllerValue: number, sendEvent?: boolean): void;

/**
 * Executes a data entry coarse (MSB) change for the current channel.
 * @param dataCoarse The value to set for the data entry coarse controller (0-127).
 */
declare function dataEntryCoarse(this: MIDIChannel, dataCoarse: number): void;

/**
 * Sends a "MIDI Note on" message and starts a note.
 * @param midiNote The MIDI note number (0-127).
 * @param velocity The velocity of the note (0-127). If less than 1, it will send a note off instead.
 */
declare function noteOn(this: MIDIChannel, midiNote: number, velocity: number): void;

/**
 * Releases a note by its MIDI note number.
 * If the note is in high performance mode and the channel is not a drum channel,
 * it kills the note instead of releasing it.
 * @param midiNote The MIDI note number to release (0-127).
 */
declare function noteOff(this: MIDIChannel, midiNote: number): void;

/**
 * Changes the program (preset) of the channel.
 * @param program The program number (0-127) to change to.
 */
declare function programChange(this: MIDIChannel, program: number): void;

/**
 * A class for dynamic modulators
 * that are assigned for more complex system exclusive messages
 */
declare class DynamicModulatorSystem {
    /**
     * The current dynamic modulator list.
     */
    modulatorList: {
        mod: VoiceModulator;
        id: string;
    }[];
    active: boolean;
    private readonly channelNumber;
    constructor(channelNumber: number);
    resetModulators(): void;
    setupReceiver(addr3: number, data: number, source: number, sourceName: string, bipolar?: boolean): void;
    /**
     * @param source Like in midiControllers: values below NON_CC_INDEX_OFFSET are CCs,
     * above are regular modulator sources.
     * @param destination The generator type to modulate.
     * @param amount The amount of modulation to apply.
     * @param isBipolar If true, the modulation is bipolar (ranges from -1 to 1 instead of from 0 to 1).
     * @param isNegative If true, the modulation is negative (goes from 1 to 0 instead of from 0 to 1).
     */
    private setModulator;
    private getModulatorID;
    private deleteModulator;
}

/**
 * Sets a master parameter of the synthesizer.
 * @param parameter The type of the master parameter to set.
 * @param value The value to set for the master parameter.
 */
declare function setMasterParameterInternal<P extends keyof MasterParameterType>(this: SynthesizerCore, parameter: P, value: MasterParameterType[P]): void;
/**
 * Gets a master parameter of the synthesizer.
 * @param type The type of the master parameter to get.
 * @returns The value of the master parameter.
 */
declare function getMasterParameterInternal<P extends keyof MasterParameterType>(this: SynthesizerCore, type: P): MasterParameterType[P];
/**
 * Gets all master parameters of the synthesizer.
 * @returns All the master parameters.
 */
declare function getAllMasterParametersInternal(this: SynthesizerCore): MasterParameterType;

type SysExAcceptedArray = number[] | IndexedByteArray | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array | Uint8ClampedArray | Float32Array | Float64Array;

/**
 * Executes a system exclusive message for the synthesizer.
 * @param syx The system exclusive message as an array of bytes.
 * @param channelOffset The channel offset to apply (default is 0).
 * @remarks
 * This is a rather extensive method that handles various system exclusive messages,
 * including Roland GS, MIDI Tuning Standard, and other non-realtime messages.
 */
declare function systemExclusiveInternal(this: SynthesizerCore, syx: SysExAcceptedArray, channelOffset?: number): void;

declare const NON_CC_INDEX_OFFSET = 128;
declare const CONTROLLER_TABLE_SIZE = 147;
/**
 * An array with the default MIDI controller values. Note that these are 14-bit, not 7-bit.
 */
declare const defaultMIDIControllerValues: Int16Array<ArrayBuffer>;
declare const setResetValue: (i: MIDIController, v: number) => number;
declare const CUSTOM_CONTROLLER_TABLE_SIZE: number;
declare const customResetArray: Float32Array<ArrayBuffer>;
declare const drumReverbResetArray: Int8Array<ArrayBuffer>;

declare const DEFAULT_MASTER_PARAMETERS: MasterParameterType;

/**
 * Default MIDI drum channel.
 */
declare const DEFAULT_PERCUSSION = 9;
declare const ALL_CHANNELS_OR_DIFFERENT_ACTION = -1;

declare class ThruFX implements InsertionProcessor {
    sendLevelToReverb: number;
    sendLevelToChorus: number;
    sendLevelToDelay: number;
    readonly type = 0;
    reset(): void;
    process(inputLeft: Float32Array, inputRight: Float32Array, outputLeft: Float32Array, outputRight: Float32Array, outputReverb: Float32Array, outputChorus: Float32Array, outputDelay: Float32Array, startIndex: number, sampleCount: number): void;
    setParameter(parameter: number, value: number): void;
}

/**
 * The core synthesis engine which interacts with channels and holds all the synth parameters.
 */
declare class SynthesizerCore {
    /**
     * Voices of this synthesizer, as a fixed voice pool.
     */
    readonly voices: Voice[];
    /**
     * All MIDI channels of the synthesizer.
     */
    readonly midiChannels: MIDIChannel[];
    /**
     * The maximum allowed buffer size to render.
     */
    readonly maxBufferSize: number;
    /**
     * The buffer to use when rendering a voice.
     */
    readonly voiceBuffer: Float32Array<ArrayBuffer>;
    /**
     * The insertion processor's left input buffer.
     */
    readonly insertionInputL: Float32Array<ArrayBuffer>;
    /**
     * The insertion processor's right input buffer.
     */
    readonly insertionInputR: Float32Array<ArrayBuffer>;
    /**
     * The reverb processor's input buffer.
     */
    readonly reverbInput: Float32Array<ArrayBuffer>;
    /**
     * The chorus processor's input buffer.
     */
    readonly chorusInput: Float32Array<ArrayBuffer>;
    /**
     * The delay processor's input buffer.
     */
    readonly delayInput: Float32Array<ArrayBuffer>;
    /**
     * Delay is not used outside SC-88+ MIDIs, this is an optimization.
     */
    delayActive: boolean;
    /**
     * The sound bank manager, which manages all sound banks and presets.
     */
    soundBankManager: SoundBankManager;
    /**
     * Handles the custom key overrides: velocity and preset
     */
    keyModifierManager: KeyModifierManager;
    readonly sampleRate: number;
    /**
     * This.tunings[program * 128 + key] = midiNote,cents (fraction)
     * All MIDI Tuning Standard tunings, 128 keys for each of 128 programs.
     * -1 means no change.
     */
    readonly tunings: Float32Array<ArrayBuffer>;
    /**
     * The master parameters of the synthesizer.
     */
    masterParameters: {
        masterGain: number;
        masterPan: number;
        voiceCap: number;
        autoAllocateVoices: boolean;
        interpolationType: InterpolationType;
        midiSystem: SynthSystem;
        monophonicRetriggerMode: boolean;
        reverbGain: number;
        reverbLock: boolean;
        chorusGain: number;
        chorusLock: boolean;
        delayGain: number;
        delayLock: boolean;
        insertionEffectLock: boolean;
        drumLock: boolean;
        customVibratoLock: boolean;
        nprnParamLock: boolean;
        blackMIDIMode: boolean;
        transposition: number;
        deviceID: number;
    };
    /**
     * The current time of the synthesizer, in seconds.
     */
    currentTime: number;
    /**
     * The volume gain, set by MIDI sysEx
     */
    midiVolume: number;
    /**
     * Are the chorus and reverb effects enabled?
     */
    enableEffects: boolean;
    /**
     * Is the event system enabled?
     */
    enableEventSystem: boolean;
    /**
     * The pan of the left channel.
     */
    panLeft: number;
    /**
     * The pan of the right channel.
     */
    panRight: number;
    /**
     * Synth's default (reset) preset.
     */
    defaultPreset: BasicPreset | undefined;
    /**
     * Synth's default (reset) drum preset.
     */
    drumPreset: BasicPreset | undefined;
    /**
     * Gain smoothing factor, adjusted to the sample rate.
     */
    readonly gainSmoothingFactor: number;
    /**
     * Pan smoothing factor, adjusted to the sample rate.
     */
    readonly panSmoothingFactor: number;
    /**
     * Calls when an event occurs.
     * @param eventType The event type.
     * @param eventData The event data.
     */
    eventCallbackHandler: <K extends keyof SynthProcessorEventData>(eventType: K, eventData: SynthProcessorEventData[K]) => unknown;
    readonly missingPresetHandler: (patch: MIDIPatch, system: SynthSystem) => undefined | BasicPreset;
    /**
     * Cached voices for all presets for this synthesizer.
     * Nesting is calculated in getCachedVoiceIndex, returns a list of voices for this note.
     */
    readonly cachedVoices: Map<number, CachedVoiceList>;
    /**
     * Sets a master parameter of the synthesizer.
     * @param type The type of the master parameter to set.
     * @param value The value to set for the master parameter.
     */
    readonly setMasterParameter: typeof setMasterParameterInternal;
    /**
     * Gets a master parameter of the synthesizer.
     * @param type The type of the master parameter to get.
     * @returns The value of the master parameter.
     */
    readonly getMasterParameter: typeof getMasterParameterInternal;
    /**
     * Gets all master parameters of the synthesizer.
     * @returns All the master parameters.
     */
    readonly getAllMasterParameters: typeof getAllMasterParametersInternal;
    readonly systemExclusive: typeof systemExclusiveInternal;
    /**
     * Current total amount of voices that are currently playing.
     */
    voiceCount: number;
    /**
     * A sysEx may set a "Part" (channel) to receive on a different channel number.
     * This slows down the access, so this toggle tracks if it's enabled or not.
     */
    customChannelNumbers: boolean;
    /**
     * The synthesizer's reverb processor.
     */
    readonly reverbProcessor: ReverbProcessor;
    /**
     * The synthesizer's chorus processor.
     */
    readonly chorusProcessor: ChorusProcessor;
    /**
     * The synthesizer's delay processor.
     */
    readonly delayProcessor: DelayProcessor;
    /**
     * The fallback processor when the requested insertion is not available.
     */
    protected readonly insertionFallback: ThruFX;
    /**
     * The current insertion processor.
     */
    protected insertionProcessor: InsertionProcessor;
    /**
     * All the insertion effects available to the processor.
     * The key is the EFX type stored as MSB << 8 | LSB
     */
    protected readonly insertionEffects: Map<number, InsertionProcessor>;
    /**
     * Insertion is not used outside SC-88Pro+ MIDIs, this is an optimization.
     */
    protected insertionActive: boolean;
    /**
     * For F5 system exclusive.
     */
    protected portSelectChannelOffset: number;
    /**
     * For insertion snapshot tracking
     * 20 parameters (0-19) + 3 sends
     * Index to gs is Addr3 - 3 (for example EFX PARAMETER 1 is 0x03 and here it's 0)
     * note: 255 means "no change"
     * @protected
     */
    protected insertionParams: Uint8Array<ArrayBuffer>;
    /**
     * Last time the priorities were assigned.
     * Used to prevent assigning priorities multiple times when more than one voice is triggered during a quantum.
     */
    private lastPriorityAssignmentTime;
    /**
     * Synth's event queue from the main thread
     */
    private eventQueue;
    /**
     * The time of a single sample, in seconds.
     */
    private readonly sampleTime;
    constructor(eventCallbackHandler: <K extends keyof SynthProcessorEventData>(eventType: K, eventData: SynthProcessorEventData[K]) => unknown, missingPresetHandler: (patch: MIDIPatch, system: SynthSystem) => BasicPreset | undefined, sampleRate: number, options: SynthProcessorOptions);
    controllerChange(channel: number, controllerNumber: MIDIController, controllerValue: number): void;
    noteOn(channel: number, midiNote: number, velocity: number): void;
    noteOff(channel: number, midiNote: number): void;
    polyPressure(channel: number, midiNote: number, pressure: number): void;
    channelPressure(channel: number, pressure: number): void;
    pitchWheel(channel: number, pitch: number, midiNote?: number): void;
    programChange(channel: number, programNumber: number): void;
    /**
     * Assigns the first available voice for use.
     * If none available, will assign priorities.
     */
    assignVoice(): Voice;
    /**
     * Stops all notes on all channels.
     * @param force if true, all notes are stopped immediately, otherwise they are stopped gracefully.
     */
    stopAllChannels(force: boolean): void;
    /**
     * Processes a raw MIDI message.
     * @param message The message to process.
     * @param channelOffset The channel offset for the message.
     * @param options Additional options for scheduling the message.
     */
    processMessage(message: Uint8Array | number[], channelOffset?: number, options?: SynthMethodOptions): void;
    destroySynthProcessor(): void;
    /**
     * @param channel channel to get voices for
     * @param midiNote the MIDI note to use
     * @param velocity the velocity to use
     * @returns output is an array of Voices
     */
    getVoices(channel: number, midiNote: number, velocity: number): CachedVoiceList;
    createMIDIChannel(sendEvent: boolean): void;
    /**
     * Executes a full system reset of all controllers.
     * This will reset all controllers to their default values,
     * except for the locked controllers.
     */
    resetAllControllers(system?: SynthSystem): void;
    process(left: Float32Array, right: Float32Array, startIndex?: number, sampleCount?: number): void;
    /**
     * The main rendering pipeline, renders all voices the processes the effects:
     * ```
     *                   ┌────────────────────────────────┐
     *                   │        Voice Processor         │
     *                   └───────────────┬────────────────┘
     *                                   │
     *                   ┌───────────────┴────────────────┐
     *                   │      Insertion Processor       │
     *                   │      (Bypass or Process)       │
     *                   └───────────────┬────────────────┘
     *                                   │
     *              ┌──────────┬─────────┼────────────────────────┐
     *              │          │         │                        │
     *              │          │         𜸊                        │
     *              │          │ ┌───────┴───────┐                │
     *              │          │ │    Chorus     │                │
     *              │          │ │   Processor   ├──────────┐     │
     *              │          │ └─┬──────────┬──┘          │     │
     *              │          │   │          │             │     │
     *              │          │   │          │             │     │
     *              │          │   │          │             │     │
     *              │          │   │          │             │     │
     *              │          │   │          𜸊             𜸊     𜸊
     *              │          │   │ ┌────────┴───────┐   ┌─┴─────┴────────┐
     *              │          └───┼>┤     Delay      ├─>>┤     Reverb     │
     *              │              │ │   Processor    │   │   Processor    │
     *              │              │ └────────┬───────┘   └───────┬────────┘
     *              │              │          │                   │
     *              │              │          │                   │
     *              │              │          │                   │
     *              │              │          │                   │
     *              𜸊              𜸊          𜸊                   𜸊
     *    ┌─────────┴──────────┐ ┌─┴──────────┴───────────────────┴────┐
     *    │  Dry Output Pairs  │ │        Stereo Effects Output        │
     *    └────────────────────┘ └─────────────────────────────────────┘
     * ```
     * The pipeline is quite similar to the one on SC-8850 manual page 78.
     * All output arrays must be the same length, the method will crash otherwise.
     * @param outputs The stereo pairs for each MIDI channel's dry output, will be wrapped if less.
     * @param effectsLeft The left stereo effect output buffer.
     * @param effectsRight The right stereo effect output buffer.
     * @param startIndex The index to start writing at into the output buffer.
     * @param samples The amount of samples to write.
     */
    processSplit(outputs: Float32Array[][], effectsLeft: Float32Array, effectsRight: Float32Array, startIndex?: number, samples?: number): void;
    /**
     * Gets voices for a preset.
     * @param preset The preset to get voices for.
     * @param midiNote The MIDI note to use.
     * @param velocity The velocity to use.
     * @returns Output is an array of voices.
     */
    getVoicesForPreset(preset: BasicPreset, midiNote: number, velocity: number): CachedVoiceList;
    clearCache(): void;
    getInsertionSnapshot(): InsertionProcessorSnapshot;
    /**
     * Copied callback so MIDI channels can call it.
     */
    callEvent<K extends keyof SynthProcessorEventData>(eventName: K, eventData: SynthProcessorEventData[K]): void;
    protected resetInsertionParams(): void;
    protected resetInsertion(): void;
    /**
     * @param volume {number} 0 to 1
     */
    protected setMIDIVolume(volume: number): void;
    /**
     * Sets the synth's primary tuning.
     * @param cents
     */
    protected setMasterTuning(cents: number): void;
    protected setReverbMacro(macro: number): void;
    protected setChorusMacro(macro: number): void;
    protected setDelayMacro(macro: number): void;
    protected getCachedVoice(patch: MIDIPatch, midiNote: number, velocity: number): CachedVoiceList | undefined;
    protected setCachedVoice(patch: MIDIPatch, midiNote: number, velocity: number, voices: CachedVoiceList): void;
    private registerInsertionProcessor;
    private processMessageInternal;
    /**
     * Assigns priorities to the voices.
     * Gets the priority of a voice based on its channel and state.
     * Higher priority means the voice is more important and should be kept longer.
     */
    private assignVoicePriorities;
    private updatePresetList;
    private getDefaultPresets;
    private getCachedVoiceIndex;
}

/**
 * Represents a single drum instrument's XG/GS parameters.
 */
declare class DrumParameters {
    /**
     * Pitch offset in cents.
     */
    pitch: number;
    /**
     * Gain multiplier.
     */
    gain: number;
    /**
     * Exclusive class override.
     */
    exclusiveClass: number;
    /**
     * Pan, 1-64-127, 0 is random. This adds to the channel pan!
     */
    pan: number;
    /**
     * Reverb multiplier.
     */
    reverbGain: number;
    /**
     * Chorus multiplier.
     */
    chorusGain: number;
    /**
     * Delay multiplier.
     */
    delayGain: number;
    /**
     * If note on should be received.
     */
    rxNoteOn: boolean;
    /**
     * If note off should be received.
     * Note:
     * Due to the way sound banks implement drums (as 100s release time),
     * this means killing the voice on note off, not releasing it.
     */
    rxNoteOff: boolean;
    copyInto(p: DrumParameters): this;
}

/**
 * This class represents a single MIDI Channel within the synthesizer.
 */
declare class MIDIChannel {
    /**
     * An array of MIDI controllers for the channel.
     * This array is used to store the state of various MIDI controllers
     * such as volume, pan, modulation, etc.
     * @remarks
     * A bit of an explanation:
     * The controller table is stored as an int16 array, it stores 14-bit values.
     * This controller table is then extended with the modulatorSources section,
     * for example, pitch range and pitch range depth.
     * This allows us for precise control range and supports full pitch-wheel resolution.
     */
    readonly midiControllers: Int16Array;
    /**
     * An array for the MIDI 2.0 Per-note pitch wheels.
     */
    readonly pitchWheels: Int16Array<ArrayBuffer>;
    /**
     * An array indicating if a controller, at the equivalent index in the midiControllers array, is locked
     * (i.e., not allowed changing).
     * A locked controller cannot be modified.
     */
    lockedControllers: boolean[];
    /**
     * An array of custom (non-SF2) control values such as RPN pitch tuning, transpose, modulation depth, etc.
     * Refer to controller_tables.ts for the index definitions.
     */
    readonly customControllers: Float32Array;
    /**
     * An array of octave tuning values for each note on the channel.
     * Each index corresponds to a note (0 = C, 1 = C#, ..., 11 = B).
     * Note: Repeated every 12 notes.
     */
    readonly octaveTuning: Int8Array;
    /**
     * Parameters for each drum instrument.
     */
    readonly drumParams: DrumParameters[];
    /**
     * A system for dynamic modulator assignment for advanced system exclusives.
     */
    readonly sysExModulators: DynamicModulatorSystem;
    /**
     * The key shift of the channel (in semitones).
     */
    keyShift: number;
    /**
     * Indicates whether this channel is a drum channel.
     */
    drumChannel: boolean;
    /**
     * Enables random panning for every note played on this channel.
     */
    randomPan: boolean;
    /**
     * Indicates whether this channel uses the insertion EFX processor.
     */
    insertionEnabled: boolean;
    /**
     * CC1 for GS controller matrix.
     * An arbitrary MIDI controller, which can be bound to any synthesis parameter.
     */
    cc1: number;
    /**
     * CC2 for GS controller matrix.
     * An arbitrary MIDI controller, which can be bound to any synthesis parameter.
     */
    cc2: number;
    /**
     * Drum map for GS system exclusive tracking.
     * Only used for selecting the correct channel when setting drum parameters through sysEx,
     * as those don't specify the channel, but the drum number.
     */
    drumMap: number;
    /**
     * The current state of the data entry for the channel.
     */
    dataEntryState: DataEntryState;
    /**
     * The currently selected MIDI patch of the channel.
     * Note that the exact matching preset may not be available, but this represents exactly what MIDI asks for.
     */
    readonly patch: MIDIPatch;
    /**
     * The preset currently assigned to the channel.
     * Note that this may be undefined in some cases
     * https://github.com/spessasus/spessasynth_core/issues/48
     */
    preset?: BasicPreset;
    /**
     * Indicates whether the program on this channel is locked.
     */
    lockPreset: boolean;
    /**
     * Indicates the MIDI system when the preset was locked.
     */
    lockedSystem: SynthSystem;
    /**
     * The vibrato settings for the channel.
     * @property depth - Depth of the vibrato effect in cents.
     * @property delay - Delay before the vibrato effect starts (in seconds).
     * @property rate - Rate of the vibrato oscillation (in Hz).
     */
    readonly channelVibrato: {
        delay: number;
        depth: number;
        rate: number;
    };
    /**
     * If the channel is in the poly mode.
     * True - POLY ON - regular playback.
     * False - MONO ON - one note per channel, others are killed on note-on
     */
    polyMode: boolean;
    /**
     * Channel's current voice count
     */
    voiceCount: number;
    /**
     * The channel's number (0-based index)
     */
    readonly channel: number;
    /**
     * The channel's receiving number (0-based index)
     * Only used when customChannelNumbers is enabled
     */
    rxChannel: number;
    /**
     * Core synthesis engine.
     */
    synthCore: SynthesizerCore;
    /**
     * Sends a "MIDI Note on" message and starts a note.
     * @param midiNote The MIDI note number (0-127).
     * @param velocity The velocity of the note (0-127). If less than 1, it will send a note off instead.
     */
    noteOn: typeof noteOn;
    /**
     * Releases a note by its MIDI note number.
     * If the note is in high performance mode and the channel is not a drum channel,
     * it kills the note instead of releasing it.
     * @param midiNote The MIDI note number to release (0-127).
     */
    noteOff: typeof noteOff;
    /**
     * Changes the program (preset) of the channel.
     * @param programNumber The program number (0-127) to change to.
     */
    programChange: typeof programChange;
    controllerChange: typeof controllerChange;
    /**
     * Reset all controllers for channel.
     * This will reset all controllers to their default values,
     * except for the locked controllers.
     */
    readonly resetControllers: typeof resetControllers;
    readonly resetPreset: typeof resetPreset;
    /**
     * https://amei.or.jp/midistandardcommittee/Recommended_Practice/e/rp15.pdf
     * Reset controllers according to RP-15 Recommended Practice.
     */
    readonly resetControllersRP15Compliant: typeof resetControllersRP15Compliant;
    /**
     * Reset all parameters to their default values.
     * This includes NRPN and RPN controllers, data entry state,
     * and generator overrides and offsets.
     */
    resetParameters: typeof resetParameters;
    /**
     * Executes a data entry fine (LSB) change for the current channel.
     * @param dataValue The value to set for the data entry fine controller (0-127).
     */
    dataEntryFine: typeof dataEntryFine;
    /**
     * Executes a data entry coarse (MSB) change for the current channel.
     * @param dataValue The value to set for the data entry coarse controller (0-127).
     */
    dataEntryCoarse: typeof dataEntryCoarse;
    readonly renderVoice: (voice: Voice, timeNow: number, outputL: Float32Array<ArrayBufferLike>, outputR: Float32Array<ArrayBufferLike>, startIndex: number, sampleCount: number) => void;
    /**
     * Per-note pitch wheel mode uses the pitchWheels table as source
     * instead of the regular entry in the midiControllers table.
     */
    protected perNotePitch: boolean;
    /**
     * Will be updated every time something tuning-related gets changed.
     * This is used to avoid a big addition for every voice rendering call.
     */
    protected channelTuningCents: number;
    /**
     * An array of offsets generators for SF2 nrpn support.
     * A value of 0 means no change; -10 means 10 lower, etc.
     */
    protected generatorOffsets: Int16Array;
    /**
     * A small optimization that disables applying offsets until at least one is set.
     */
    protected generatorOffsetsEnabled: boolean;
    /**
     * An array of override generators for AWE32 support.
     * A value of 32,767 means unchanged, as it is not allowed anywhere.
     */
    protected generatorOverrides: Int16Array;
    /**
     * A small optimization that disables applying overrides until at least one is set.
     */
    protected generatorOverridesEnabled: boolean;
    protected readonly computeModulator: (voice: Voice, pitchWheel: number, modulatorIndex: number) => number;
    protected readonly computeModulators: (voice: Voice, sourceUsesCC?: 0 | 1 | -1 | undefined, sourceIndex?: number | undefined) => void;
    /**
     * For tracking voice count changes
     * @private
     */
    private previousVoiceCount;
    /**
     * Constructs a new MIDI channel.
     */
    constructor(synthProps: SynthesizerCore, preset: BasicPreset | undefined, channelNumber: number);
    /**
     * Indicates whether the channel is muted.
     */
    protected _isMuted: boolean;
    /**
     * Indicates whether the channel is muted.
     */
    get isMuted(): boolean;
    protected get channelSystem(): SynthSystem;
    clearVoiceCount(): void;
    updateVoiceCount(): void;
    /**
     * Transposes the channel by given amount of semitones.
     * @param semitones The number of semitones to transpose the channel by. Can be decimal.
     * @param force Defaults to false, if true, it will force the transpose even if the channel is a drum channel.
     */
    transposeChannel(semitones: number, force?: boolean): void;
    /**
     * Sets the octave tuning for a given channel.
     * @param tuning The tuning array of 12 values, each representing the tuning for a note in the octave.
     * @remarks
     * Cent tunings are relative.
     */
    setOctaveTuning(tuning: Int8Array): void;
    /**
     * Sets the modulation depth for the channel.
     * @param cents The modulation depth in cents to set.
     * @remarks
     * This method sets the modulation depth for the channel by converting the given cents value into a
     * multiplier. The MIDI specification assumes the default modulation depth is 50 cents,
     * but it may vary for different sound banks.
     * For example, if you want a modulation depth of 100 cents,
     * the multiplier will be 2,
     * which, for a preset with a depth of 50,
     * will create a total modulation depth of 100 cents.
     *
     */
    setModulationDepth(cents: number): void;
    /**
     * Sets the channel's tuning.
     * @param cents The tuning in cents to set.
     * @param log If true, logs the change to the console.
     */
    setTuning(cents: number, log?: boolean): void;
    /**
     * Sets the pitch of the given channel.
     * @param pitch The pitch (0 - 16384)
     * @param midiNote The MIDI note number, pass -1 for the regular pitch wheel
     */
    pitchWheel(pitch: number, midiNote?: number): void;
    /**
     * Sets the channel pressure (MIDI Aftertouch).
     * @param pressure the pressure of the channel.
     */
    channelPressure(pressure: number): void;
    /**
     * Sets the pressure of the given note on a specific channel.
     * This is used for polyphonic pressure (aftertouch).
     * @param midiNote 0 - 127, the MIDI note number to set the pressure for.
     * @param pressure 0 - 127, the pressure value to set for the note.
     */
    polyPressure(midiNote: number, pressure: number): void;
    setCustomController(type: CustomController, value: number): void;
    updateChannelTuning(): void;
    /**
     * Locks or unlocks the preset from MIDI program changes.
     * @param locked If the preset should be locked.
     */
    setPresetLock(locked: boolean): void;
    /**
     * Changes the preset to, or from drums.
     * Note that this executes a program change.
     * @param isDrum If the channel should be a drum preset or not.
     */
    setDrums(isDrum: boolean): void;
    /**
     * Sets the channel to a given MIDI patch.
     * Note that this executes a program change.
     * @param patch The MIDI patch to set the channel to.
     */
    setPatch(patch: MIDIPatch): void;
    /**
     * Sets the GM/GS drum flag.
     * @param drums
     */
    setGSDrums(drums: boolean): void;
    resetGeneratorOverrides(): void;
    setGeneratorOverride(gen: GeneratorType, value: number, realtime?: boolean): void;
    resetGeneratorOffsets(): void;
    setGeneratorOffset(gen: GeneratorType, value: number): void;
    /**
     * Stops a note nearly instantly.
     * @param midiNote The note to stop.
     * @param releaseTime in timecents, defaults to -12000 (very short release).
     */
    killNote(midiNote: number, releaseTime?: number): void;
    /**
     * Stops all notes on the channel.
     * @param force If true, stops all notes immediately, otherwise applies release time.
     */
    stopAllNotes(force?: boolean): void;
    /**
     * Mutes or unmutes a channel.
     * @param isMuted If the channel should be muted.
     */
    muteChannel(isMuted: boolean): void;
    /**
     * Sends this channel's property
     */
    sendChannelProperty(): void;
    protected resetDrumParams(): void;
    protected resetVibratoParams(): void;
    protected computeModulatorsAll(sourceUsesCC: -1 | 0 | 1, sourceIndex: number): void;
    protected setBankMSB(bankMSB: number): void;
    protected setBankLSB(bankLSB: number): void;
    /**
     * Sets drums on channel.
     */
    protected setDrumFlag(isDrum: boolean): void;
}

/**
 * Processor.ts
 * purpose: the core synthesis engine
 */
declare class SpessaSynthProcessor {
    /**
     * Controls if the processor is fully initialized.
     */
    readonly processorInitialized: Promise<boolean>;
    /**
     * Sample rate in Hertz.
     */
    readonly sampleRate: number;
    /**
     * Calls when an event occurs.
     * @param event The event that occurred.
     */
    onEventCall?: (event: SynthProcessorEvent) => unknown;
    /**
     * Renders float32 audio data to stereo outputs; buffer size must be equal or smaller than `maxBufferSize`
     * All float arrays must have the same length.
     * @param left the left output channel.
     * @param right the right output channel.
     * @param startIndex start offset of the passed arrays, rendering starts at this index, defaults to 0.
     * @param sampleCount the length of the rendered buffer, defaults to float32array length - startOffset.
     */
    readonly process: (left: Float32Array, right: Float32Array, startIndex?: number, sampleCount?: number) => void;
    /**
     * Renders float32 audio data to stereo outputs; buffer size must be equal or smaller than `maxBufferSize
     * All float arrays must have the same length.
     * @param outputs any number stereo pairs (L, R) to render channels separately into.
     * @param effectsLeft the left stereo effect output buffer.
     * @param effectsRight the left stereo effect output buffer.
     * @param startIndex start offset of the passed arrays, rendering starts at this index, defaults to 0.
     * @param sampleCount the length of the rendered buffer, defaults to float32array length - startOffset.
     */
    readonly processSplit: (outputs: Float32Array[][], effectsLeft: Float32Array, effectsRight: Float32Array, startIndex?: number, sampleCount?: number) => void;
    /**
     * Executes a system exclusive message for the synthesizer.
     * @param syx The system exclusive message as an array of bytes.
     * @param channelOffset The channel offset to apply (default is 0).
     */
    readonly systemExclusive: (syx: SysExAcceptedArray, channelOffset?: number) => void;
    /**
     * Executes a MIDI controller change message on the specified channel.
     * @param channel The MIDI channel to change the controller on.
     * @param controllerNumber The MIDI controller number to change.
     * @param controllerValue The value to set the controller to.
     */
    readonly controllerChange: (channel: number, controllerNumber: MIDIController, controllerValue: number) => void;
    /**
     * Executes a MIDI Note-on message on the specified channel.
     * @param channel The MIDI channel to send the note on.
     * @param midiNote The MIDI note number to play.
     * @param velocity The velocity of the note, from 0 to 127.
     * @remarks
     * If the velocity is 0, it will be treated as a Note-off message.
     */
    readonly noteOn: (channel: number, midiNote: number, velocity: number) => void;
    /**
     * Executes a MIDI Note-off message on the specified channel.
     * @param channel The MIDI channel to send the note off.
     * @param midiNote The MIDI note number to stop playing.
     */
    readonly noteOff: (channel: number, midiNote: number) => void;
    /**
     * Executes a MIDI Poly Pressure (Aftertouch) message on the specified channel.
     * @param channel The MIDI channel to send the poly pressure on.
     * @param midiNote The MIDI note number to apply the pressure to.
     * @param pressure The pressure value, from 0 to 127.
     */
    readonly polyPressure: (channel: number, midiNote: number, pressure: number) => void;
    /**
     * Executes a MIDI Channel Pressure (Aftertouch) message on the specified channel.
     * @param channel The MIDI channel to send the channel pressure on.
     * @param pressure The pressure value, from 0 to 127.
     */
    readonly channelPressure: (channel: number, pressure: number) => void;
    /**
     * Executes a MIDI Pitch Wheel message on the specified channel.
     * @param channel The MIDI channel to send the pitch wheel on.
     * @param pitch The new pitch value: 0-16384
     * @param midiNote The MIDI note number (optional), pass -1 for the regular pitch wheel.
     */
    readonly pitchWheel: (channel: number, pitch: number, midiNote?: number) => void;
    /**
     * Executes a MIDI Program Change message on the specified channel.
     * @param channel The MIDI channel to send the program change on.
     * @param programNumber The program number to change to, from 0 to 127.
     */
    readonly programChange: (channel: number, programNumber: number) => void;
    /**
     * Processes a raw MIDI message.
     * @param message The message to process.
     * @param channelOffset The channel offset for the message.
     * @param options Additional options for scheduling the message.
     */
    readonly processMessage: (message: Uint8Array | number[], channelOffset?: number, options?: SynthMethodOptions) => void;
    /**
     * Core synthesis engine.
     */
    private readonly synthCore;
    /**
     * Tor applying the snapshot after an override sound bank too.
     */
    private savedSnapshot?;
    /**
     * Creates a new synthesizer engine.
     * @param sampleRate sample rate, in Hertz.
     * @param opts the processor's options.
     */
    constructor(sampleRate: number, opts?: Partial<SynthProcessorOptions>);
    /**
     * Are the chorus and reverb effects enabled?
     */
    get enableEffects(): boolean;
    /**
     * Are the chorus and reverb effects enabled?
     */
    set enableEffects(v: boolean);
    /**
     * Is the event system enabled?
     */
    get enableEventSystem(): boolean;
    /**
     * Is the event system enabled?
     */
    set enableEventSystem(v: boolean);
    /**
     * All MIDI channels of the synthesizer.
     */
    get midiChannels(): MIDIChannel[];
    /**
     * Current total amount of voices that are currently playing.
     */
    get totalVoicesAmount(): number;
    /**
     * The current time of the synthesizer, in seconds. You probably should not modify this directly.
     */
    get currentSynthTime(): number;
    /**
     * Synthesizer's reverb processor.
     */
    get reverbProcessor(): ReverbProcessor;
    /**
     * Synthesizer's chorus processor.
     */
    get chorusProcessor(): ChorusProcessor;
    /**
     * Synthesizer's delay processor.
     */
    get delayProcessor(): DelayProcessor;
    /**
     * The sound bank manager, which manages all sound banks and presets.
     */
    get soundBankManager(): SoundBankManager;
    /**
     * Handles the custom key overrides: velocity and preset
     */
    get keyModifierManager(): KeyModifierManager;
    /**
     * Renders float32 audio data to stereo outputs; buffer size of 128 is recommended.
     * All float arrays must have the same length.
     * @param outputs output stereo channels (L, R).
     * @param reverb unused legacy parameter.
     * @param chorus unused legacy parameter.
     * @param startIndex start offset of the passed arrays, rendering starts at this index, defaults to 0.
     * @param sampleCount the length of the rendered buffer, defaults to float32array length - startOffset.
     * @deprecated use process() as the effects are now integrated.
     */
    renderAudio(outputs: Float32Array[], reverb: Float32Array[], chorus: Float32Array[], startIndex?: number, sampleCount?: number): void;
    /**
     * Renders the float32 audio data of each channel, routing effects to external outputs.
     * Buffer size of 128 is recommended.
     * All float arrays must have the same length.
     * @param reverbChannels unused legacy parameter.
     * @param chorusChannels unused legacy parameter.
     * @param separateChannels a total of 16 stereo pairs (L, R) for each MIDI channel.
     * @param startIndex start offset of the passed arrays, rendering starts at this index, defaults to 0.
     * @param sampleCount the length of the rendered buffer, defaults to float32array length - startOffset.
     * @deprecated use processSplit() as the effects are now integrated.
     */
    renderAudioSplit(reverbChannels: Float32Array[], chorusChannels: Float32Array[], separateChannels: Float32Array[][], startIndex?: number, sampleCount?: number): void;
    /**
     * A handler for missing presets during program change. By default, it warns to console.
     * @param patch The MIDI patch that was requested.
     * @param system The MIDI System for the request.
     * @returns If a BasicPreset instance is returned, it will be used by the channel.
     */
    onMissingPreset: (patch: MIDIPatch, system: SynthSystem) => BasicPreset | undefined;
    /**
     * Sets a master parameter of the synthesizer.
     * @param type The type of the master parameter to set.
     * @param value The value to set for the master parameter.
     */
    setMasterParameter<P extends keyof MasterParameterType>(type: P, value: MasterParameterType[P]): void;
    /**
     * Gets a master parameter of the synthesizer.
     * @param type The type of the master parameter to get.
     * @returns The value of the master parameter.
     */
    getMasterParameter<P extends keyof MasterParameterType>(type: P): MasterParameterType[P];
    /**
     * Gets all master parameters of the synthesizer.
     * @returns All the master parameters.
     */
    getAllMasterParameters(): MasterParameterType;
    /**
     * Executes a full system reset of all controllers.
     * This will reset all controllers to their default values,
     * except for the locked controllers.
     */
    resetAllControllers(system?: SynthSystem): void;
    /**
     * Applies the snapshot to the synth
     */
    applySynthesizerSnapshot(snapshot: SynthesizerSnapshot): void;
    /**
     * Gets a synthesizer snapshot from this processor instance.
     */
    getSnapshot(): SynthesizerSnapshot;
    /**
     * @internal
     */
    getInsertionSnapshot(): InsertionProcessorSnapshot;
    /**
     * Sets the embedded sound bank.
     * @param bank The sound bank file to set.
     * @param offset The bank offset of the embedded sound bank.
     */
    setEmbeddedSoundBank(bank: ArrayBuffer, offset: number): void;
    clearEmbeddedBank(): void;
    createMIDIChannel(): void;
    /**
     * Stops all notes on all channels.
     * @param force if true, all notes are stopped immediately, otherwise they are stopped gracefully.
     */
    stopAllChannels(force?: boolean): void;
    /**
     *  Destroy the synthesizer processor, clearing all channels and voices.
     *  This is irreversible, so use with caution.
     */
    destroySynthProcessor(): void;
    /**
     * DEPRECATED, does nothing!
     * @param amount
     * @deprecated
     */
    killVoices(amount: number): void;
    /**
     * Clears the synthesizer's voice cache.
     */
    clearCache(): void;
    /**
     * Gets voices for a preset.
     * @param preset The preset to get voices for.
     * @param midiNote The MIDI note to use.
     * @param velocity The velocity to use.
     * @returns Output is an array of voices.
     * @remarks
     * This is a public method, but it is only intended to be used by the sequencer.
     * @internal
     */
    getVoicesForPreset(preset: BasicPreset, midiNote: number, velocity: number): CachedVoiceList;
    /**
     * Calls synth event
     * @param eventName the event name
     * @param eventData the event data
     */
    private callEvent;
    private missingPreset;
}

/**
 * Represents a snapshot of a single channel's state in the synthesizer.
 */
declare class ChannelSnapshot {
    /**
     * The MIDI patch that the channel is using.
     */
    patch: MIDIPatchNamed;
    /**
     * Indicates whether the channel's program change is disabled.
     */
    lockPreset: boolean;
    /**
     * Indicates the MIDI system when the preset was locked
     */
    lockedSystem: SynthSystem;
    /**
     * The array of all MIDI controllers (in 14-bit values) with the modulator sources at the end.
     */
    midiControllers: Int16Array;
    /**
     * An array of booleans, indicating if the controller with a current index is locked.
     */
    lockedControllers: boolean[];
    /**
     * Array of custom (not SF2) control values such as RPN pitch tuning, transpose, modulation depth, etc.
     */
    customControllers: Float32Array;
    /**
     * The channel's vibrato settings.
     * @property depth Vibrato depth, in gain.
     * @property delay Vibrato delay from note on in seconds.
     * @property rate Vibrato rate in Hz.
     */
    channelVibrato: {
        depth: number;
        delay: number;
        rate: number;
    };
    /**
     * Key shift for the channel.
     */
    keyShift: number;
    /**
     * The channel's octave tuning in cents.
     */
    octaveTuning: Int8Array;
    /**
     * Parameters for each drum instrument.
     */
    drumParams: DrumParameters[];
    /**
     * Indicates whether the channel is muted.
     */
    isMuted: boolean;
    /**
     * Indicates whether the channel is a drum channel.
     */
    drumChannel: boolean;
    /**
     * The channel number this snapshot represents.
     */
    channelNumber: number;
    constructor(patch: MIDIPatchNamed, lockPreset: boolean, lockedSystem: SynthSystem, midiControllers: Int16Array, lockedControllers: boolean[], customControllers: Float32Array, channelVibrato: {
        delay: number;
        depth: number;
        rate: number;
    }, channelTransposeKeyShift: number, channelOctaveTuning: Int8Array, drumParams: DrumParameters[], isMuted: boolean, drumChannel: boolean, channelNumber: number);
    /**
     * Creates a copy of existing snapshot.
     * @param snapshot The snapshot to create a copy from.
     */
    static copyFrom(snapshot: ChannelSnapshot): ChannelSnapshot;
    /**
     * Creates a snapshot of the channel's state.
     * @param spessaSynthProcessor The synthesizer processor containing the channel.
     * @param channelNumber The channel number to take a snapshot of.
     */
    static create(spessaSynthProcessor: SpessaSynthProcessor, channelNumber: number): ChannelSnapshot;
    /**
     * Applies the snapshot to the specified channel.
     * @param spessaSynthProcessor The processor containing the channel.
     */
    apply(spessaSynthProcessor: SpessaSynthProcessor): void;
}

/**
 * Represents a snapshot of the synthesizer's state.
 */
declare class SynthesizerSnapshot {
    /**
     * The individual channel snapshots.
     */
    channelSnapshots: ChannelSnapshot[];
    /**
     * Key modifiers.
     */
    keyMappings: (KeyModifier | undefined)[][];
    masterParameters: MasterParameterType;
    reverbSnapshot: ReverbProcessorSnapshot;
    chorusSnapshot: ChorusProcessorSnapshot;
    delaySnapshot: DelayProcessorSnapshot;
    insertionSnapshot: InsertionProcessorSnapshot;
    constructor(channelSnapshots: ChannelSnapshot[], masterParameters: MasterParameterType, keyMappings: (KeyModifier | undefined)[][], reverbSnapshot: ReverbProcessorSnapshot, chorusSnapshot: ChorusProcessorSnapshot, delaySnapshot: DelayProcessorSnapshot, insertionSnapshot: InsertionProcessorSnapshot);
    /**
     * Creates a new synthesizer snapshot from the given SpessaSynthProcessor.
     * @param processor the processor to take a snapshot of.
     * @returns The snapshot.
     */
    static create(processor: SpessaSynthProcessor): SynthesizerSnapshot;
    /**
     * Creates a copy of existing snapshot.
     * @param snapshot The snapshot to create a copy from.
     */
    static copyFrom(snapshot: SynthesizerSnapshot): SynthesizerSnapshot;
    /**
     * Applies the snapshot to the synthesizer.
     * @param processor the processor to apply the snapshot to.
     */
    apply(processor: SpessaSynthProcessor): void;
}

interface ModifyMIDIOptions {
    programChanges: DesiredProgramChange[];
    controllerChanges: DesiredControllerChange[];
    channelsToClear: number[];
    channelsToTranspose: DesiredChannelTranspose[];
    clearDrumParams: boolean;
    reverbParams?: ReverbProcessorSnapshot;
    chorusParams?: ChorusProcessorSnapshot;
    delayParams?: DelayProcessorSnapshot;
    insertionParams?: InsertionProcessorSnapshot;
}

declare class MIDITrack {
    /**
     * The name of this track.
     */
    name: string;
    /**
     * The MIDI port number used by the track.
     */
    port: number;
    /**
     * A set that contains the MIDI channels used by the track in the sequence.
     */
    channels: Set<number>;
    /**
     * All the MIDI messages of this track.
     */
    events: Omit<MIDIMessage[], "push" | "splice">;
    static copyFrom(track: MIDITrack): MIDITrack;
    copyFrom(track: MIDITrack): void;
    /**
     * Adds an event to the track.
     * @param event The event to add.
     * @param index The index at which to add this event.
     * @deprecated Use addEvents instead
     */
    addEvent(event: MIDIMessage, index: number): void;
    /**
     * Adds events to the track.
     * @param index The index at which to add these event.
     * @param events The events to add.
     */
    addEvents(index: number, ...events: MIDIMessage[]): void;
    /**
     * Removes an event from the track.
     * @param index The index of the event to remove.
     */
    deleteEvent(index: number): void;
    /**
     * Appends an event to the end of the track.
     * @param event The event to add.
     */
    pushEvent(event: MIDIMessage): void;
}

/**
 * BasicMIDI is the base of a complete MIDI file.
 */
declare class BasicMIDI {
    /**
     * The tracks in the sequence.
     */
    tracks: MIDITrack[];
    /**
     * The time division of the sequence, representing the number of MIDI ticks per beat.
     */
    timeDivision: number;
    /**
     * The duration of the sequence, in seconds.
     */
    duration: number;
    /**
     * The tempo changes in the sequence, ordered from the last change to the first.
     * Each change is represented by an object with a MIDI tick position and a tempo value in beats per minute.
     */
    tempoChanges: TempoChange[];
    /**
     * Any extra metadata found in the file.
     * These messages were deemed "interesting" by the parsing algorithm
     */
    extraMetadata: MIDIMessage[];
    /**
     * An array containing the lyrics of the sequence.
     */
    lyrics: MIDIMessage[];
    /**
     * The tick position of the first note-on event in the MIDI sequence.
     */
    firstNoteOn: number;
    /**
     * The MIDI key range used in the sequence, represented by a minimum and maximum note value.
     */
    keyRange: GenericRange;
    /**
     * The tick position of the last voice event (such as note-on, note-off, or control change) in the sequence.
     */
    lastVoiceEventTick: number;
    /**
     * An array of channel offsets for each MIDI port, using the SpessaSynth method.
     * The index is the port number and the value is the channel offset.
     */
    portChannelOffsetMap: number[];
    /**
     * The loop points (in ticks) of the sequence, including both start and end points.
     */
    loop: MIDILoop;
    /**
     * The file name of the MIDI sequence, if provided during parsing.
     */
    fileName?: string;
    /**
     * The format of the MIDI file, which can be 0, 1, or 2, indicating the type of the MIDI file.
     */
    format: MIDIFormat;
    /**
     * The RMID (Resource-Interchangeable MIDI) info data, if the file is RMID formatted.
     * Otherwise, this object is empty.
     * Info type: Chunk data as a binary array.
     * Note that text chunks contain a terminal zero byte.
     */
    rmidiInfo: Partial<Record<keyof RMIDInfoData, Uint8Array<ArrayBuffer>>>;
    /**
     * The bank offset used for RMID files.
     */
    bankOffset: number;
    /**
     * If the MIDI file is a Soft Karaoke file (.kar), this is set to true.
     * https://www.mixagesoftware.com/en/midikit/help/HTML/karaoke_formats.html
     */
    isKaraokeFile: boolean;
    /**
     * Indicates if this file is a Multi-Port MIDI file.
     */
    isMultiPort: boolean;
    /**
     * If the MIDI file is a DLS RMIDI file.
     */
    isDLSRMIDI: boolean;
    /**
     * The embedded sound bank in the MIDI file, represented as an ArrayBuffer, if available.
     */
    embeddedSoundBank?: ArrayBuffer;
    /**
     * The raw, encoded MIDI name, represented as a Uint8Array.
     * Useful when the MIDI file uses a different code page.
     * Undefined if no MIDI name could be found.
     */
    protected binaryName?: Uint8Array;
    /**
     * The encoding of the RMIDI info in file, if specified.
     */
    get infoEncoding(): string | undefined;
    /**
     * Loads a MIDI file (SMF, RMIDI, XMF) from a given ArrayBuffer.
     * @param arrayBuffer The ArrayBuffer containing the binary file data.
     * @param fileName The optional name of the file, will be used if the MIDI file does not have a name.
     */
    static fromArrayBuffer(arrayBuffer: ArrayBuffer, fileName?: string): BasicMIDI;
    /**
     * Loads a MIDI file (SMF, RMIDI, XMF) from a given file.
     * @param file The file to load.
     */
    static fromFile(file: File): Promise<BasicMIDI>;
    /**
     * Copies a MIDI.
     * @param mid The MIDI to copy.
     * @returns The copied MIDI.
     */
    static copyFrom(mid: BasicMIDI): BasicMIDI;
    /**
     * Copies a MIDI.
     * @param mid The MIDI to copy.
     */
    copyFrom(mid: BasicMIDI): void;
    /**
     * Converts MIDI ticks to time in seconds.
     * @param ticks The time in MIDI ticks.
     * @returns The time in seconds.
     */
    midiTicksToSeconds(ticks: number): number;
    /**
     * Converts seconds to time in MIDI ticks.
     * @param seconds The time in seconds.
     * @returns The time in MIDI ticks.
     */
    secondsToMIDITicks(seconds: number): number;
    /**
     * Gets the used programs and keys for this MIDI file with a given sound bank.
     * @param soundbank the sound bank.
     * @returns The output data is a key-value pair: preset -> Set<"key-velocity">
     */
    getUsedProgramsAndKeys(soundbank: BasicSoundBank | SoundBankManager): Map<BasicPreset, Set<string>>;
    /**
     * Preloads all voices for this sequence in a given synth.
     * This caches all the needed voices for playing back this sequencer, resulting in a smooth playback.
     * The sequencer calls this function by default when loading the songs.
     * @param synth
     */
    preloadSynth(synth: SpessaSynthProcessor): void;
    /**
     * Updates all internal values of the MIDI.
     * @param sortEvents if the events should be sorted by ticks. Recommended to be true.
     */
    flush(sortEvents?: boolean): void;
    /**
     * Calculates all note times in seconds.
     * @param minDrumLength the shortest a drum note (channel 10) can be, in seconds.
     * @returns an array of 16 channels, each channel containing its notes,
     * with their key number, velocity, absolute start time and length in seconds.
     */
    getNoteTimes(minDrumLength?: number): NoteTime[][];
    /**
     * Exports the midi as a standard MIDI file.
     * @returns the binary file data.
     */
    writeMIDI(): ArrayBuffer;
    /**
     * Writes an RMIDI file. Note that this method modifies the MIDI file in-place.
     * @param soundBankBinary the binary sound bank to embed into the file.
     * @param configuration Extra options for writing the file.
     * @returns the binary file data.
     */
    writeRMIDI(soundBankBinary: ArrayBuffer, configuration?: Partial<RMIDIWriteOptions>): ArrayBuffer;
    /**
     * Allows easy editing of the file by removing channels, changing programs,
     * changing controllers and transposing channels. Note that this modifies the MIDI *in-place*.
     * @param desiredProgramChanges - The programs to set on given channels.
     * @param controllerChanges - The controllers to set on given channels.
     * @param channelsToClear - The channels to remove from the sequence.
     * @param channelsToTranspose - The channels to transpose.
     * @param clearDrumParams - If the drum parameters should be cleared.
     * @param reverbParams - The desired GS reverb params, leave undefined for no change.
     * @param chorusParams - The desired GS chorus params, leave undefined for no change.
     * @param delayParams - The desired GS delay params, leave undefined for no change.
     */
    modify({ programChanges, controllerChanges, channelsToClear, channelsToTranspose, clearDrumParams, reverbParams, chorusParams, delayParams, insertionParams }: ModifyMIDIOptions): void;
    /**
     * Modifies the sequence *in-place* according to the locked presets and controllers in the given snapshot.
     * @param snapshot the snapshot to apply.
     */
    applySnapshot(snapshot: SynthesizerSnapshot): void;
    /**
     * Gets the MIDI's decoded name.
     * @param encoding The encoding to use if the MIDI uses an extended code page.
     * @remarks
     * Do not call in audioWorkletGlobalScope as it uses TextDecoder.
     * RMIDI encoding overrides the provided encoding.
     */
    getName(encoding?: string): string | undefined;
    /**
     * Gets the decoded extra metadata as text and removes any unneeded characters (such as "@T" for karaoke files)
     * @param encoding The encoding to use if the MIDI uses an extended code page.
     * @remarks
     * Do not call in audioWorkletGlobalScope as it uses TextDecoder.
     * RMIDI encoding overrides the provided encoding.
     */
    getExtraMetadata(encoding?: string): string[];
    /**
     * Sets a given RMIDI info value.
     * @param infoType The type to set.
     * @param infoData The value to set it to.
     * @remarks
     * This sets the Info encoding to utf-8.
     */
    setRMIDInfo<K extends keyof RMIDInfoData>(infoType: K, infoData: RMIDInfoData[K]): void;
    /**
     * Gets a given chunk from the RMIDI information, undefined if it does not exist.
     * @param infoType The metadata type.
     * @returns String, Date, ArrayBuffer or undefined.
     */
    getRMIDInfo<K extends keyof RMIDInfoData>(infoType: K): RMIDInfoData[K] | undefined;
    /**
     * Iterates over the MIDI file, ordered by the time the events happen.
     * @param callback The callback function to process each event.
     */
    iterate(callback: (event: MIDIMessage, trackNumber: number, eventIndexes: number[]) => unknown): void;
    /**
     * INTERNAL USE ONLY!
     */
    protected copyMetadataFrom(mid: BasicMIDI): void;
    /**
     * Parses internal MIDI values
     */
    protected parseInternal(): void;
}

/**
 * Represents a single sound bank, be it DLS or SF2.
 */
declare class BasicSoundBank {
    /**
     * Indicates if the SF3/SF2Pack decoder is ready.
     */
    static isSF3DecoderReady: Promise<boolean>;
    /**
     * Sound bank's info.
     */
    soundBankInfo: SoundBankInfoData;
    /**
     * The sound bank's presets.
     */
    presets: BasicPreset[];
    /**
     * The sound bank's samples.
     */
    samples: BasicSample[];
    /**
     * The sound bank's instruments.
     */
    instruments: BasicInstrument[];
    /**
     * Sound bank's default modulators.
     */
    defaultModulators: Modulator[];
    /**
     * If the sound bank has custom default modulators (DMOD).
     */
    customDefaultModulators: boolean;
    private _isXGBank;
    /**
     * Checks for XG drum sets and considers if this sound bank is XG.
     */
    get isXGBank(): boolean;
    /**
     * Merges sound banks with the given order. Keep in mind that the info read is copied from the first one
     * @param soundBanks the sound banks to merge, the first overwrites the last
     */
    static mergeSoundBanks(...soundBanks: BasicSoundBank[]): BasicSoundBank;
    /**
     * Creates a simple sound bank with one saw wave preset.
     */
    static getSampleSoundBankFile(): Promise<ArrayBuffer>;
    /**
     * Copies a given sound bank.
     * @param bank The sound bank to copy.
     */
    static copyFrom(bank: BasicSoundBank): BasicSoundBank;
    /**
     * Adds complete presets along with their instruments and samples.
     * @param presets The presets to add.
     */
    addCompletePresets(presets: BasicPreset[]): void;
    /**
     * Write the sound bank as a .dls file. This may not be 100% accurate.
     * @param options - options for writing the file.
     * @returns the binary file.
     */
    writeDLS(options?: Partial<DLSWriteOptions>): Promise<ArrayBuffer>;
    /**
     * Writes the sound bank as an SF2 file.
     * @param writeOptions the options for writing.
     * @returns the binary file data.
     */
    writeSF2(writeOptions?: Partial<SoundFont2WriteOptions>): Promise<ArrayBuffer>;
    addPresets(...presets: BasicPreset[]): void;
    addInstruments(...instruments: BasicInstrument[]): void;
    addSamples(...samples: BasicSample[]): void;
    /**
     * Clones a sample into this bank.
     * @param sample The sample to copy.
     * @returns the copied sample, if a sample exists with that name, it is returned instead
     */
    cloneSample(sample: BasicSample): BasicSample;
    /**
     * Recursively clones an instrument into this sound bank, as well as its samples.
     * @returns the copied instrument, if an instrument exists with that name, it is returned instead.
     */
    cloneInstrument(instrument: BasicInstrument): BasicInstrument;
    /**
     * Recursively clones a preset into this sound bank, as well as its instruments and samples.
     * @returns the copied preset, if a preset exists with that name, it is returned instead.
     */
    clonePreset(preset: BasicPreset): BasicPreset;
    /**
     * Updates internal values.
     */
    flush(): void;
    /**
     * Trims a sound bank to only contain samples in a given MIDI file.
     * @param mid - the MIDI file
     */
    trimSoundBank(mid: BasicMIDI): void;
    removeUnusedElements(): void;
    deleteInstrument(instrument: BasicInstrument): void;
    deletePreset(preset: BasicPreset): void;
    deleteSample(sample: BasicSample): void;
    /**
     * Get the appropriate preset.
     */
    getPreset(patch: MIDIPatch, system: SynthSystem): BasicPreset;
    destroySoundBank(): void;
    protected parsingError(error: string): void;
    /**
     * Parses the bank after loading is done
     * @protected
     */
    protected parseInternal(): void;
    protected printInfo(): void;
}

interface SoundBankManagerListEntry {
    /**
     * The unique string identifier of the sound bank.
     */
    id: string;
    /**
     * The sound bank itself.
     */
    soundBank: BasicSoundBank;
    /**
     * The bank MSB offset for this sound bank.
     */
    bankOffset: number;
}
interface SF2VersionTag {
    /**
     * The major revision number of the sound bank.
     */
    major: number;
    /**
     * The minor revision number of this sound bank.
     */
    minor: number;
}
type GenericBankInfoFourCC = "INAM" | "ICRD" | "IENG" | "IPRD" | "ICOP" | "ICMT" | "ISFT";
type SF2InfoFourCC = GenericBankInfoFourCC | "ifil" | "isng" | "irom" | "iver" | "DMOD" | "LIST";
type SF2ChunkFourCC = "pdta" | "xdta" | "sdta" | "smpl" | "sm24" | "phdr" | "pbag" | "pmod" | "pgen" | "inst" | "ibag" | "imod" | "igen" | "shdr";
type DLSInfoFourCC = GenericBankInfoFourCC | "ISBJ";
type DLSChunkFourCC = WAVFourCC | "dls " | "dlid" | "cdl " | "ptbl" | "vers" | "colh" | "wvpl" | "wsmp" | "data" | "lart" | "lar2" | "art2" | "art1" | "lrgn" | "rgnh" | "wlnk" | "lins" | "ins " | "insh" | "rgn " | "rgn2" | "pgal";
interface SoundBankInfoData {
    /**
     * Name.
     */
    name: string;
    /**
     * The sound bank's version.
     */
    version: SF2VersionTag;
    /**
     * Creation date.
     */
    creationDate: Date;
    /**
     * Sound engine.
     */
    soundEngine: string;
    /**
     * Author.
     */
    engineer?: string;
    /**
     * Product.
     */
    product?: string;
    /**
     * Copyright.
     */
    copyright?: string;
    /**
     * Comment.
     */
    comment?: string;
    /**
     * Subject.
     */
    subject?: string;
    /**
     * ROM information.
     */
    romInfo?: string;
    /**
     * Software used to edit the file.
     */
    software?: string;
    /**
     * A tag that only applies to SF2 and will usually be undefined.
     */
    romVersion?: SF2VersionTag;
}
type SoundBankInfoFourCC = keyof SoundBankInfoData;
interface VoiceParameters {
    generators: Int16Array;
    modulators: Modulator[];
    sample: BasicSample;
}
type SampleEncodingFunction = (audioData: Float32Array, sampleRate: number) => Promise<Uint8Array>;
type ModulatorSourceIndex = ModulatorSourceEnum | MIDIController;
/**
 * A function to track progress during writing.
 */
type ProgressFunction = (
/**
 * The written sample name.
 */
sampleName: string, 
/**
 * The sample's index.
 */
sampleIndex: number, 
/**
 * The total sample count for progress displaying.
 */
sampleCount: number) => Promise<unknown>;
/**
 * Options for writing a SoundFont2 file.
 */
interface SoundFont2WriteOptions {
    /**
     * If the soundfont should be compressed with a given function.
     */
    compress: boolean;
    /**
     * The function for compressing samples. It can be undefined if not compressed.
     */
    compressionFunction?: SampleEncodingFunction;
    /**
     * A function to show progress for writing large banks. It can be undefined.
     */
    progressFunction?: ProgressFunction;
    /**
     * If the DMOD chunk should be written. Recommended.
     * Note that it will only be written if the modulators are unchanged.
     */
    writeDefaultModulators: boolean;
    /**
     * If the XDTA chunk should be written to allow virtually infinite parameters. Recommended.
     * Note that it will only be written needed.
     */
    writeExtendedLimits: boolean;
    /**
     * If an SF3 bank should be decompressed back to SF2. Not recommended.
     */
    decompress: boolean;
}
/**
 * Options for writing a DLS file.
 */
interface DLSWriteOptions {
    /**
     * A function to show progress for writing large banks. It can be undefined.
     */
    progressFunction?: ProgressFunction;
}
interface GenericRange {
    min: number;
    max: number;
}
interface DLSLoop {
    loopType: DLSLoopType;
    loopStart: number;
    loopLength: number;
}

type GenericRIFFFourCC = "RIFF" | "LIST" | "INFO";
type WAVFourCC = "wave" | "cue " | "fmt ";
type FourCC = GenericRIFFFourCC | SoundBankInfoFourCC | SF2InfoFourCC | SF2ChunkFourCC | DLSInfoFourCC | DLSChunkFourCC | RMIDInfoFourCC | WAVFourCC;

declare const SpessaSynthCoreUtils: {
    consoleColors: {
        warn: string;
        unrecognized: string;
        info: string;
        recognized: string;
        value: string;
    };
    SpessaSynthInfo: typeof SpessaSynthInfo;
    SpessaSynthWarn: typeof SpessaSynthWarn;
    SpessaSynthGroupCollapsed: typeof SpessaSynthGroupCollapsed;
    SpessaSynthGroup: typeof SpessaSynthGroup;
    SpessaSynthGroupEnd: typeof SpessaSynthGroupEnd;
    readBytesAsUintBigEndian: typeof readBigEndian;
    readLittleEndian: typeof readLittleEndianIndexed;
    readBytesAsString: typeof readBinaryStringIndexed;
    readVariableLengthQuantity: typeof readVariableLengthQuantity;
    inflateSync: (input: Uint8Array) => Uint8Array<ArrayBuffer>;
};

declare const DEFAULT_WAV_WRITE_OPTIONS: WaveWriteOptions;
interface WaveWriteOptions {
    /**
     * This will find the max sample point and set it to 1, and scale others with it. Recommended
     */
    normalizeAudio: boolean;
    /**
     * The loop start and end points in seconds. Undefined if no loop should be written.
     */
    loop?: {
        /**
         * The start point in seconds.
         */
        start: number;
        /**
         * The end point in seconds.
         */
        end: number;
    };
    /**
     * The metadata to write into the file.
     */
    metadata: Partial<WaveMetadata>;
}
interface WaveMetadata {
    /**
     * The song's title.
     */
    title: string;
    /**
     * The song's artist.
     */
    artist: string;
    /**
     * The song's album.
     */
    album: string;
    /**
     * The song's genre.
     */
    genre: string;
}

interface MIDIBuilderOptions {
    /**
     * The MIDI file's tick precision (how many ticks fit in a quarter note).
     */
    timeDivision: number;
    /**
     * The MIDI file's initial tempo in BPM.
     */
    initialTempo: number;
    /**
     * The MIDI file's MIDI track format.
     */
    format: MIDIFormat;
    /**
     * The MIDI file's name. Will be appended to the conductor track.
     */
    name: string;
}
/**
 * A class that helps to build a MIDI file from scratch.
 */
declare class MIDIBuilder extends BasicMIDI {
    private encoder;
    /**
     * Creates a new MIDI file.
     * @param options The options for writing the file.
     */
    constructor(options?: Partial<MIDIBuilderOptions>);
    /**
     * Adds a new Set Tempo event.
     * @param ticks the tick number of the event.
     * @param tempo the tempo in beats per minute (BPM).
     */
    addSetTempo(ticks: number, tempo: number): void;
    /**
     * Adds a new MIDI track.
     * @param name the new track's name.
     * @param port the new track's port.
     */
    addNewTrack(name: string, port?: number): void;
    /**
     * Adds a new MIDI Event.
     * @param ticks the tick time of the event (absolute).
     * @param track the track number to use.
     * @param event the MIDI event number.
     * @param eventData {Uint8Array|Iterable<number>} the raw event data.
     */
    addEvent(ticks: number, track: number, event: MIDIMessageType, eventData: Uint8Array | Iterable<number>): void;
    /**
     * Adds a new Note On event.
     * @param ticks the tick time of the event.
     * @param track the track number to use.
     * @param channel the channel to use.
     * @param midiNote the midi note of the keypress.
     * @param velocity the velocity of the keypress.
     */
    addNoteOn(ticks: number, track: number, channel: number, midiNote: number, velocity: number): void;
    /**
     * Adds a new Note Off event.
     * @param ticks the tick time of the event.
     * @param track the track number to use.
     * @param channel the channel to use.
     * @param midiNote the midi note of the key release.
     * @param velocity optional and unsupported by spessasynth.
     */
    addNoteOff(ticks: number, track: number, channel: number, midiNote: number, velocity?: number): void;
    /**
     * Adds a new Program Change event.
     * @param ticks the tick time of the event.
     * @param track the track number to use.
     * @param channel the channel to use.
     * @param programNumber the MIDI program to use.
     */
    addProgramChange(ticks: number, track: number, channel: number, programNumber: number): void;
    /**
     * Adds a new Controller Change event.
     * @param ticks the tick time of the event.
     * @param track the track number to use.
     * @param channel the channel to use.
     * @param controllerNumber the MIDI CC to use.
     * @param controllerValue the new CC value.
     */
    addControllerChange(ticks: number, track: number, channel: number, controllerNumber: number, controllerValue: number): void;
    /**
     * Adds a new Pitch Wheel event.
     * @param ticks the tick time of the event.
     * @param track the track to use.
     * @param channel the channel to use.
     * @param MSB SECOND byte of the MIDI pitchWheel message.
     * @param LSB FIRST byte of the MIDI pitchWheel message.
     */
    addPitchWheel(ticks: number, track: number, channel: number, MSB: number, LSB: number): void;
}

interface SequencerEventData {
    /**
     * Called when a MIDI message is sent and externalMIDIPlayback is true.
     */
    midiMessage: {
        /**
         * The binary MIDI message.
         */
        message: Iterable<number>;
        /**
         * The synthesizer's current time when this event was sent.
         * Use this for scheduling MIDI messages to your external MIDI device.
         */
        time: number;
    };
    /**
     * Called when the time is changed.
     * It also gets called when a song gets changed.
     */
    timeChange: {
        /**
         * The new time in seconds.
         */
        newTime: number;
    };
    /**
     * Called when the playback stops.
     * @deprecated use songEnded instead.
     */
    pause: {
        /**
         * True if the playback stopped because it finished playing the song, false if it was stopped manually.
         */
        isFinished: boolean;
    };
    /**
     * Called when the playback stops.
     */
    songEnded: object;
    /**
     * Called when the song changes.
     */
    songChange: {
        /**
         * The index of the new song in the song list.
         */
        songIndex: number;
    };
    /**
     * Called when the song list changes.
     */
    songListChange: {
        /**
         * The new song list.
         */
        newSongList: BasicMIDI[];
    };
    /**
     * Called when a MIDI Meta event is encountered.
     */
    metaEvent: {
        /**
         * The MIDI message of the meta event.
         */
        event: MIDIMessage;
        /**
         * The index of the track where the meta event was encountered.
         */
        trackIndex: number;
    };
    /**
     * Called when the loop count changes (decreases).
     */
    loopCountChange: {
        /**
         * The new loop count.
         */
        newCount: number;
    };
}
type SequencerEvent = {
    [K in keyof SequencerEventData]: {
        type: K;
        data: SequencerEventData[K];
    };
}[keyof SequencerEventData];

/**
 * Processes a single MIDI tick.
 * Call this every rendering quantum to process the sequencer events in real-time.
 */
declare function processTick(this: SpessaSynthSequencer): void;

/**
 * Plays the MIDI file to a specific time or ticks.
 * @param time in seconds.
 * @param ticks optional MIDI ticks, when given is used instead of time.
 * @returns true if the MIDI file is not finished.
 */
declare function setTimeToInternal(this: SpessaSynthSequencer, time: number, ticks?: number | undefined): boolean;

declare class SpessaSynthSequencer {
    /**
     * Sequencer's song list.
     */
    songs: BasicMIDI[];
    /**
     * The shuffled song indexes.
     * This is used when shuffle mode is enabled.
     */
    readonly shuffledSongIndexes: number[];
    /**
     * The synthesizer connected to the sequencer.
     */
    readonly synth: SpessaSynthProcessor;
    /**
     * If the MIDI messages should be sent to an event instead of the synth.
     * This is used by spessasynth_lib to pass them over to Web MIDI API.
     */
    externalMIDIPlayback: boolean;
    /**
     * If the notes that were playing when the sequencer was paused should be re-triggered.
     * Defaults to true.
     */
    retriggerPausedNotes: boolean;
    /**
     * The loop count of the sequencer.
     * If set to Infinity, it will loop forever.
     * If set to zero, the loop is disabled.
     */
    loopCount: number;
    /**
     * Indicates if the sequencer should skip to the first note on event.
     * Defaults to true.
     */
    skipToFirstNoteOn: boolean;
    /**
     * Indicates if the sequencer has finished playing.
     */
    isFinished: boolean;
    /**
     * Indicates if the synthesizer should preload the voices for the newly loaded sequence.
     * Recommended.
     */
    preload: boolean;
    /**
     * Called when the sequencer calls an event.
     * @param event The event
     */
    onEventCall?: (event: SequencerEvent) => unknown;
    /**
     * Processes a single MIDI tick.
     * You should call this every rendering quantum to process the sequencer events in real-time.
     */
    processTick: typeof processTick;
    /**
     * The time of the first note in seconds.
     */
    protected firstNoteTime: number;
    /**
     * How long a single MIDI tick currently lasts in seconds.
     */
    protected oneTickToSeconds: number;
    /**
     * The current event index for each track.
     * This is used to track which event is currently being processed for each track.
     */
    protected eventIndexes: number[];
    /**
     * The time that has already been played in the current song.
     */
    protected playedTime: number;
    /**
     * The paused time of the sequencer.
     * If the sequencer is not paused, this is undefined.
     */
    protected pausedTime?: number;
    /**
     * Absolute time of the sequencer when it started playing.
     * It is based on the synth's current time.
     */
    protected absoluteStartTime: number;
    /**
     * Currently playing notes (for pausing and resuming)
     */
    protected playingNotes: {
        midiNote: number;
        channel: number;
        velocity: number;
    }[];
    /**
     * MIDI Port number for each of the MIDI tracks in the current sequence.
     */
    protected currentMIDIPorts: number[];
    /**
     * This is used to assign new MIDI port offsets to new ports.
     */
    protected midiPortChannelOffset: number;
    /**
     * Channel offsets for each MIDI port.
     * Stored as:
     * Record<midi port, channel offset>
     */
    protected midiPortChannelOffsets: Record<number, number>;
    protected assignMIDIPort: (trackNum: number, port: number) => void;
    protected loadNewSequence: (parsedMidi: BasicMIDI) => void;
    protected processEvent: (event: MIDIMessage, trackIndex: number) => void;
    protected setTimeTo: typeof setTimeToInternal;
    /**
     * Initializes a new Sequencer without any songs loaded.
     * @param spessasynthProcessor the synthesizer processor to use with this sequencer.
     */
    constructor(spessasynthProcessor: SpessaSynthProcessor);
    protected _midiData?: BasicMIDI;
    /**
     * The currently loaded MIDI data.
     */
    get midiData(): BasicMIDI | undefined;
    /**
     * The length of the current sequence in seconds.
     */
    get duration(): number;
    protected _songIndex: number;
    /**
     * The current song index in the song list.
     * If shuffle mode is enabled, this is the index of the shuffled song list.
     */
    get songIndex(): number;
    /**
     * The current song index in the song list.
     * If shuffle mode is enabled, this is the index of the shuffled song list.
     */
    set songIndex(value: number);
    protected _shuffleMode: boolean;
    /**
     * Controls if the sequencer should shuffle the songs in the song list.
     * If true, the sequencer will play the songs in a random order.
     * Songs are shuffled on a `loadNewSongList` call.
     */
    get shuffleMode(): boolean;
    /**
     * Controls if the sequencer should shuffle the songs in the song list.
     * If true, the sequencer will play the songs in a random order.
     * Songs are shuffled on a `loadNewSongList` call.
     */
    set shuffleMode(on: boolean);
    /**
     * Internal playback rate.
     */
    protected _playbackRate: number;
    /**
     * The sequencer's playback rate.
     * This is the rate at which the sequencer plays back the MIDI data.
     */
    get playbackRate(): number;
    /**
     * The sequencer's playback rate.
     * This is the rate at which the sequencer plays back the MIDI data.
     * @param value the playback rate to set.
     */
    set playbackRate(value: number);
    /**
     * The current time of the sequencer.
     * This is the time in seconds since the sequencer started playing.
     */
    get currentTime(): number;
    /**
     * The current time of the sequencer.
     * This is the time in seconds since the sequencer started playing.
     * @param time the time to set in seconds.
     */
    set currentTime(time: number);
    /**
     * True if paused, false if playing or stopped
     */
    get paused(): boolean;
    /**
     * Starts or resumes the playback of the sequencer.
     * If the sequencer is paused, it will resume from the paused time.
     */
    play(): void;
    /**
     * Pauses the playback.
     */
    pause(): void;
    /**
     * Loads a new song list into the sequencer.
     * @param midiBuffers the list of songs to load.
     */
    loadNewSongList(midiBuffers: BasicMIDI[]): void;
    protected callEvent<K extends keyof SequencerEventData>(type: K, data: SequencerEventData[K]): void;
    protected pauseInternal(isFinished: boolean): void;
    protected songIsFinished(): void;
    /**
     * Stops the playback
     */
    protected stop(): void;
    /**
     * @returns The track number of the next closest event, based on eventIndexes.
     */
    protected findFirstEventIndex(): number;
    /**
     * Adds a new port (16 channels) to the synth.
     */
    protected addNewMIDIPort(): void;
    protected sendMIDIMessage(message: number[]): void;
    protected sendMIDIAllOff(): void;
    protected sendMIDIReset(): void;
    protected loadCurrentSong(): void;
    protected shuffleSongIndexes(): void;
    /**
     * Sets the time in MIDI ticks.
     * @param ticks the MIDI ticks to set the time to.
     */
    protected setTimeTicks(ticks: number): void;
    /**
     * Recalculates the absolute start time of the sequencer.
     * @param time the time in seconds to recalculate the start time for.
     */
    protected recalculateStartTime(time: number): void;
    /**
     * Jumps to a MIDI tick without any further processing.
     * @param targetTicks The MIDI tick to jump to.
     * @protected
     */
    protected jumpToTick(targetTicks: number): void;
    protected sendMIDINoteOn(channel: number, midiNote: number, velocity: number): void;
    protected sendMIDINoteOff(channel: number, midiNote: number): void;
    protected sendMIDICC(channel: number, type: MIDIController, value: number): void;
    /**
     * Sets the pitch of the given channel
     * @param channel usually 0-15: the channel to change pitch
     * @param pitch the 14-bit pitch value
     */
    protected sendMIDIPitchWheel(channel: number, pitch: number): void;
}

export { ALL_CHANNELS_OR_DIFFERENT_ACTION, BasicGlobalZone, BasicInstrument, BasicInstrumentZone, BasicMIDI, BasicPreset, BasicPresetZone, BasicSample, BasicSoundBank, BasicZone, CONTROLLER_TABLE_SIZE, CUSTOM_CONTROLLER_TABLE_SIZE, type CachedVoiceList, type ChannelPressureCallback, type ChannelProperty, type ChannelPropertyChangeCallback, ChannelSnapshot, type ChorusProcessor, type ChorusProcessorSnapshot, type ControllerChangeCallback, type CustomController, DEFAULT_MASTER_PARAMETERS, DEFAULT_PERCUSSION, DEFAULT_WAV_WRITE_OPTIONS, type DLSChunkFourCC, type DLSDestination, type DLSInfoFourCC, type DLSLoop, type DLSLoopType, DLSLoopTypes, type DLSSource, type DLSTransform, type DLSWriteOptions, type DataEntryState, type DelayProcessor, type DelayProcessorSnapshot, type DesiredChannelTranspose, type DesiredControllerChange, type DesiredProgramChange, type DrumChangeCallback, type EffectChangeCallback, EmptySample, type FourCC, GENERATORS_AMOUNT, Generator, type GeneratorType, type GenericBankInfoFourCC, type GenericRIFFFourCC, type GenericRange, IndexedByteArray, type InsertionProcessor, type InsertionProcessorConstructor, type InsertionProcessorSnapshot, type InterpolationType, KeyModifier, MAX_GENERATOR, MIDIBuilder, type MIDIController, type MIDIFormat, type MIDILoop, type MIDILoopType, MIDIMessage, type MIDIMessageType, type MIDIPatch, type MIDIPatchNamed, MIDIPatchTools, MIDITrack, type MasterParameterChangeCallback, type MasterParameterType, Modulator, type ModulatorCurveType, ModulatorSource, type ModulatorSourceEnum, type ModulatorSourceIndex, type ModulatorTransformType, type MuteChannelCallback, NON_CC_INDEX_OFFSET, type NoteOffCallback, type NoteOnCallback, type NoteTime, type PitchWheelCallback, type PolyPressureCallback, type PresetList, type PresetListEntry, type ProgramChangeCallback, type ProgressFunction, type RMIDIWriteOptions, type RMIDInfoData, type RMIDInfoFourCC, type ReverbProcessor, type ReverbProcessorSnapshot, type SF2ChunkFourCC, type SF2InfoFourCC, type SF2VersionTag, type SampleEncodingFunction, type SampleLoopingMode, type SampleType, type SequencerEvent, type SequencerEventData, type SoundBankErrorCallback, type SoundBankInfoData, type SoundBankInfoFourCC, SoundBankLoader, type SoundBankManagerListEntry, type SoundFont2WriteOptions, SpessaSynthCoreUtils, SpessaSynthLogging, SpessaSynthProcessor, SpessaSynthSequencer, type StopAllCallback, type SynthMethodOptions, type SynthProcessorEvent, type SynthProcessorEventData, type SynthProcessorOptions, type SynthSystem, SynthesizerSnapshot, type TempoChange, type VoiceParameters, type WaveMetadata, type WaveWriteOptions, audioToWav, customControllers, customResetArray, dataEntryStates, defaultGeneratorValues, defaultMIDIControllerValues, dlsDestinations, dlsSources, drumReverbResetArray, generatorLimits, generatorTypes, interpolationTypes, midiControllers, midiMessageTypes, modulatorCurveTypes, modulatorSources, modulatorTransformTypes, sampleTypes, setResetValue };
