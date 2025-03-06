# MIDI Intermediate Reprezentation Cheat Sheet 

---

## 1. File Structure
### Header Chunk (MThd)
| Syntax                  | Description                          | Spec Alignment           |
|-------------------------|--------------------------------------|--------------------------|
| .MIDIHeader           | Start header chunk                   | MThd chunk identifier    |
| Format < 0\|1\|2 >      | 0=single, 1=multi-track, 2=multi-song | Spec §1.1               |
| Tracks < num >          | Number of track chunks               | Spec §1.1               |
| TicksPerQuarter < num > | Timing division (TPQN)               | Spec §1.1 (Division)     |

---

## 2. Track Chunks (MTrk)
| Syntax            | Description                  | Spec Alignment           |
|-------------------|------------------------------|--------------------------|
| .TrackBegin     | Start MTrk chunk             | Spec §2.1               |
| .EndTrack       | End MTrk chunk               | Implicit length calc    |
| Meta EndOfTrack | Required end marker          | Spec §2.3               |

---

## 3. MIDI Events (Channel Messages)
**Structure:** [Δ-time] < command > [params]  
*(Delta-time in ticks from previous event)*

| Command & Syntax                | Hex Equivalent       | Spec §    |
|---------------------------------|----------------------|-----------|
| NoteOn < ch > < note > < vel >      | 8n-9n                | 3.1-3.2   |
| NoteOff < ch > < note > [vel]     | 8n                   | 3.2       |
| PolyPressure < ch > < note > val  | An                   | 3.3       |
| ControlChange < ch > < cc > val   | Bn                   | 3.4       |
| ProgramChange < ch > prog       | Cn                   | 3.5       |
| ChannelPressure < ch > val      | Dn                   | 3.6       |
| PitchBend < ch > val            | En                   | 3.7       |

---

## 4. Meta Events (FF)
| Meta Event & Syntax             | Hex Code | Spec §    |
|---------------------------------|----------|-----------|
| Meta SequenceNumber < num >     | FF 00    | 2.2.1     |
| Meta Text < string >            | FF 01    | 2.2.2     |
| Meta Copyright < string >       | FF 02    | 2.2.3     |
| Meta TrackName < string >       | FF 03    | 2.2.4     |
| Meta Instrument < string >      | FF 04    | 2.2.5     |
| Meta Lyric < string >           | FF 05    | 2.2.6     |
| Meta Marker < string >          | FF 06    | 2.2.7     |
| Meta CuePoint < string >        | FF 07    | 2.2.8     |
| Meta ProgramName < string >     | FF 08    | 2.2.9     |
| Meta DeviceName < string >      | FF 09    | 2.2.10    |
| Meta ChannelPrefix < num >      | FF 20    | 2.2.11    |
| Meta Port < num >               | FF 21    | 2.2.12    |
| Meta EndOfTrack               | FF 2F    | 2.2.15    |
| Meta Tempo < μs/beat >          | FF 51    | 2.2.16    |
| Meta SMPTE < hr mn se fr ff >   | FF 54    | 2.2.17    |
| Meta TimeSignature n/d/c/b    | FF 58    | 2.2.18    |
| Meta KeySignature < sf > < mi >   | FF 59    | 2.2.19    |
| Meta SequencerSpecific < hex >  | FF 7F    | 2.2.20    |

---

## 5. System Messages
| Syntax                          | Hex Code | Spec §    |
|---------------------------------|----------|-----------|
| SysEx < hex_data >              | F0 ... F7| 4.1       |
| SysExContinuation < hex_data >  | F7       | 4.2       |

---

## Key Improvements from Spec:
1. **Delta Timing:** Now uses relative timing instead of absolute  
   midiasm
   +0: NoteOn 0 C4 100  ; Immediate
   +120: NoteOff 0 C4 0  ; 120 ticks after previous
