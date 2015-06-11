# This was written for my appearance on On The Media.
rate = 0.25
load_samples ["/Users/ford/Desktop/OTM/ONTHEMEDIABROOKE.WAV"]
loop do
  in_thread do
    with_fx :lpf, cutoff: 90 do
      with_fx :reverb, mix: 0.5 do
        with_fx :compressor, pre_amp: 40 do
          with_fx :distortion, distort: 0.4 do
            loop do
              use_random_seed 667
              4.times do
                sample :loop_amen, rate: [1, 1, 1, -1].choose * 1.35 / 2, finish: 0.5, amp: 0.5
                sample :loop_amen, rate: 1.35
                sleep sample_duration :loop_amen, rate: 1.35
              end
            end
          end
        end
      end
    end
  end


  in_thread do
    4.times do |n|
      with_fx :pitch_shift, pitch: -10 do
	sample "/Users/ford/Desktop/OTM/ONTHEMEDIABROOKE.WAV", amp: 8
      end
    end
  end
  in_thread do
    8.times do |n|
      play_pattern_timed [:c3, :c3, :e3, :a3], [1], amp: 5
      sample :guit_e_slide, amp: 0.25, rate: 1 if n == 0
      sample :guit_e_slide, amp: 0.25, rate: 1.2 if n == 2
      sample :guit_e_slide, amp: 0.25, rate: 0.75 if n == 3
      sample :guit_e_slide, amp: 0.25, rate: 2 if n == 6
      sample :guit_e_slide, amp: 0.25, rate: 0.5 if n == 8
      sleep rate * 4
    end
  end
  with_fx :reverb do
    16.times do |ct|
      sample :drum_tom_mid_hard, amp: 0.8 if ct == 4
      sample :drum_tom_mid_hard, amp: 0.8 if ct == 8
      sample :drum_tom_mid_hard, amp: 0.8 if ct == 12
      sample :drum_tom_mid_hard, amp: 0.8 if ct == 16
      sample :perc_snap
      sleep rate * 2
    end
  end
end
