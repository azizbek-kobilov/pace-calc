import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { Box } from './src/components/Box';
import { Section } from './src/components/Section';
import { colors } from './src/theme';
import {
  PROPORTIONAL_RACES,
  QUICK_DISTANCES,
  calculatePace,
  formatDuration,
  formatMiles,
  formatPaceSeconds,
  kmToMiles,
  milesToKm,
  proportionalTime,
  timeToSeconds,
} from './src/utils/pace';

function parsePositive(value: string): number {
  const n = parseFloat(value.replace(',', '.'));
  return Number.isFinite(n) && n >= 0 ? n : 0;
}

function coerceTimeDisplay(value: string): string {
  const digits = value.replace(/\D/g, '');
  return digits === '' ? '0' : digits;
}

function coerceDistanceDisplay(value: string): string {
  const normalized = value.replace(',', '.').trim();
  if (normalized === '' || normalized === '.') return '0';
  return value;
}

const DISTANCE_FONT_SIZE = 22;

/** Shrink-wrap distance TextInput so value sits next to the unit label. */
function distanceInputWidth(value: string): number {
  const len = Math.max(value.length, 1);
  const content = Math.ceil(len * DISTANCE_FONT_SIZE * 0.58) + 4;
  return Math.max(40, Math.min(96, content));
}

function PaceCell({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: string;
}) {
  return (
    <Box color={color} dashed style={styles.paceCell}>
      <Text style={[styles.cellValue, { color }]}>
        {value} <Text style={styles.cellLabel}>{label}</Text>
      </Text>
    </Box>
  );
}

function AppContent() {
  const [miles, setMiles] = useState('1');
  const [km, setKm] = useState(milesToKm(1).toFixed(2));
  const [hours, setHours] = useState('0');
  const [minutes, setMinutes] = useState('0');
  const [seconds, setSeconds] = useState('0');
  const [lastEdited, setLastEdited] = useState<'mi' | 'km'>('mi');

  const distanceMiles = useMemo(() => {
    if (lastEdited === 'km') {
      return kmToMiles(parsePositive(km));
    }
    return parsePositive(miles);
  }, [miles, km, lastEdited]);

  const timeSec = useMemo(
    () => timeToSeconds(parsePositive(hours), parsePositive(minutes), parsePositive(seconds)),
    [hours, minutes, seconds],
  );

  const pace = useMemo(
    () => calculatePace(distanceMiles, timeSec),
    [distanceMiles, timeSec],
  );

  const setDistanceFromMiles = (value: string) => {
    const display = coerceDistanceDisplay(value);
    setLastEdited('mi');
    setMiles(display);
    const n = parsePositive(display);
    setKm(n > 0 ? milesToKm(n).toFixed(2) : '0');
  };

  const setDistanceFromKm = (value: string) => {
    const display = coerceDistanceDisplay(value);
    setLastEdited('km');
    setKm(display);
    const n = parsePositive(display);
    setMiles(n > 0 ? formatMiles(kmToMiles(n)) : '0');
  };

  const selectPreset = (presetMiles: number) => {
    setLastEdited('mi');
    setMiles(formatMiles(presetMiles));
    setKm(milesToKm(presetMiles).toFixed(2));
  };

  const onHoursChange = (text: string) => setHours(coerceTimeDisplay(text));
  const onMinutesChange = (text: string) => setMinutes(coerceTimeDisplay(text));
  const onSecondsChange = (text: string) => setSeconds(coerceTimeDisplay(text));

  const secPerMileStr = pace ? formatPaceSeconds(pace.secPerMile) : '00';
  const secPerKmStr = pace ? formatPaceSeconds(pace.secPerKm) : '00';
  const mphStr = pace ? pace.mph.toFixed(1) : '0';
  const kmhStr = pace ? pace.kmh.toFixed(1) : '0';

  return (
    <SafeAreaView style={styles.safe} edges={['top', 'bottom']}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.flex}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <Section title="Distance">
            <View style={styles.presetRow}>
              {QUICK_DISTANCES.map((d) => (
                <Box
                  key={d.label}
                  color={colors.distance}
                  onPress={() => selectPreset(d.miles)}
                  style={styles.presetBtn}
                >
                  <Text
                    style={[styles.presetText, { color: colors.distance }]}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.75}
                  >
                    {d.label}
                  </Text>
                </Box>
              ))}
            </View>
            <View style={styles.gap}>
              <Box color={colors.distance} style={styles.inputBox}>
                <View style={styles.distanceValueRow}>
                  <View style={styles.distanceInputGroup}>
                    <TextInput
                      style={[
                        styles.input,
                        Platform.OS === 'web' && styles.inputWeb,
                        {
                          color: colors.distance,
                          width: distanceInputWidth(miles),
                          minWidth: distanceInputWidth(miles),
                          maxWidth: distanceInputWidth(miles),
                        },
                      ]}
                      value={miles}
                      onChangeText={setDistanceFromMiles}
                      onBlur={() =>
                        setMiles((v) => {
                          const d = coerceDistanceDisplay(v);
                          const n = parsePositive(d);
                          setKm(n > 0 ? milesToKm(n).toFixed(2) : '0');
                          return d;
                        })
                      }
                      keyboardType="decimal-pad"
                      selectTextOnFocus
                    />
                    <Text style={[styles.unit, { color: colors.distance }]}>mi</Text>
                  </View>
                </View>
              </Box>
              <Box color={colors.distance} style={styles.inputBox}>
                <View style={styles.distanceValueRow}>
                  <View style={styles.distanceInputGroup}>
                    <TextInput
                      style={[
                        styles.input,
                        Platform.OS === 'web' && styles.inputWeb,
                        {
                          color: colors.distance,
                          width: distanceInputWidth(km),
                          minWidth: distanceInputWidth(km),
                          maxWidth: distanceInputWidth(km),
                        },
                      ]}
                      value={km}
                      onChangeText={setDistanceFromKm}
                      onBlur={() =>
                        setKm((v) => {
                          const d = coerceDistanceDisplay(v);
                          const n = parsePositive(d);
                          setMiles(n > 0 ? formatMiles(kmToMiles(n)) : '0');
                          return d;
                        })
                      }
                      keyboardType="decimal-pad"
                      selectTextOnFocus
                    />
                    <Text style={[styles.unit, { color: colors.distance }]}>km</Text>
                  </View>
                </View>
              </Box>
            </View>
          </Section>

          <Section title="Time">
            <Box color={colors.time} style={styles.timeBox}>
              <View style={styles.timeRow}>
                <View style={styles.timeField}>
                  <TextInput
                    style={[styles.timeInput, styles.timeInputWide, { color: colors.time }]}
                    value={hours}
                    onChangeText={onHoursChange}
                    onBlur={() => setHours((v) => coerceTimeDisplay(v))}
                    keyboardType="number-pad"
                    maxLength={3}
                    selectTextOnFocus
                  />
                  <Text style={[styles.timeUnit, { color: colors.time }]} numberOfLines={1}>
                    hr
                  </Text>
                </View>
                <View style={styles.timeField}>
                  <TextInput
                    style={[styles.timeInput, { color: colors.time }]}
                    value={minutes}
                    onChangeText={onMinutesChange}
                    onBlur={() => setMinutes((v) => coerceTimeDisplay(v))}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                  />
                  <Text style={[styles.timeUnit, { color: colors.time }]} numberOfLines={1}>
                    min
                  </Text>
                </View>
                <View style={styles.timeField}>
                  <TextInput
                    style={[styles.timeInput, { color: colors.time }]}
                    value={seconds}
                    onChangeText={onSecondsChange}
                    onBlur={() => setSeconds((v) => coerceTimeDisplay(v))}
                    keyboardType="number-pad"
                    maxLength={2}
                    selectTextOnFocus
                  />
                  <Text style={[styles.timeUnit, { color: colors.time }]} numberOfLines={1}>
                    sec
                  </Text>
                </View>
              </View>
            </Box>
          </Section>

          <Section title="Pace">
            <View style={styles.grid2}>
              <PaceCell color={colors.pace} value={secPerMileStr} label="sec /mi" />
              <PaceCell color={colors.pace} value={secPerKmStr} label="sec /km" />
              <PaceCell color={colors.pace} value={mphStr} label="mi/hr" />
              <PaceCell color={colors.pace} value={kmhStr} label="km/hr" />
            </View>
          </Section>

          <Section title="Proportional Race Times">
            <View style={styles.grid2}>
              {PROPORTIONAL_RACES.map((race) => {
                const est =
                  pace && timeSec > 0
                    ? formatDuration(proportionalTime(pace.secPerMile, race.miles))
                    : '00 sec';
                return (
                  <Box key={race.label} color={colors.proportional} dashed style={styles.raceCell}>
                    <Text style={[styles.raceText, { color: colors.proportional }]}>
                      {race.label}: {est}
                    </Text>
                  </Box>
                );
              })}
            </View>
          </Section>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 32,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    gap: 4,
    marginBottom: 12,
  },
  presetBtn: {
    flex: 1,
    minWidth: 0,
    paddingVertical: 6,
    paddingHorizontal: 2,
  },
  presetText: {
    fontSize: 11,
    fontWeight: '500',
    textAlign: 'center',
  },
  gap: {
    gap: 10,
  },
  inputBox: {
    width: '100%',
  },
  distanceValueRow: {
    width: '100%',
    alignItems: 'center',
  },
  distanceInputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
    gap: 2,
  },
  input: {
    fontSize: DISTANCE_FONT_SIZE,
    fontWeight: '600',
    textAlign: 'left',
    padding: 0,
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    includeFontPadding: false,
  },
  inputWeb: {
    paddingHorizontal: 0,
    margin: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  unit: {
    fontSize: DISTANCE_FONT_SIZE,
    fontWeight: '600',
    flexShrink: 0,
  },
  timeBox: {
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  timeRow: {
    flexDirection: 'row',
    width: '100%',
    gap: 4,
    justifyContent: 'space-between',
  },
  timeField: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  timeInput: {
    fontSize: DISTANCE_FONT_SIZE,
    fontWeight: '600',
    flexShrink: 0,
    width: 36,
    minWidth: 36,
    textAlign: 'right',
    padding: 0,
    includeFontPadding: false,
  },
  timeInputWide: {
    width: 44,
    minWidth: 44,
  },
  timeUnit: {
    fontSize: 20,
    fontWeight: '600',
    flexShrink: 0,
  },
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  paceCell: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
  },
  cellValue: {
    fontSize: 20,
    fontWeight: '600',
  },
  cellLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  raceCell: {
    width: '48%',
    flexGrow: 1,
    minWidth: '46%',
    paddingVertical: 12,
  },
  raceText: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
});
