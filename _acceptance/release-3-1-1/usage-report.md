### S4 round 1 — wf_cadf07c6-a9f (26 agent, 77,164 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,411 | 6 | 107,831 | 62 |
| synthesize:report | claude-sonnet-5-5 | 2 | 8,467 | 4 | 51,369 | 51 |
| review:bugs | claude-opus-5-5 | 9 | 7,899 | 18 | 450,993 | 141 |
| review:conventions | claude-opus-5-5 | 9 | 7,113 | 18 | 462,937 | 88 |
| review:measurement | claude-opus-5-5 | 10 | 6,267 | 20 | 533,468 | 129 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 5,552 | 8 | 167,803 | 43 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 4 | 5,545 | 8 | 176,583 | 42 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 4 | 4,608 | 8 | 184,163 | 37 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,238 | 6 | 82,418 | 26 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,486 | 6 | 82,870 | 13 |
| triage | claude-sonnet-5-5 | 2 | 1,804 | 4 | 37,293 | 17 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,112 | 4 | 37,738 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,052 | 4 | 37,747 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,045 | 4 | 34,413 | 7 |
| machine:bash _acceptance/release-3-1-1/chay.sh d | claude-haiku-5-5 | 2 | 1,039 | 4 | 37,754 | 7 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 1,034 | 4 | 37,752 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 978 | 4 | 37,752 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 2 | 961 | 4 | 37,752 | 6 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 940 | 4 | 37,738 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 880 | 4 | 37,794 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh v | claude-haiku-5-5 | 2 | 843 | 4 | 37,753 | 7 |
| machine:bash _acceptance/release-3-1-1/chay.sh c | claude-haiku-5-5 | 2 | 768 | 4 | 37,753 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh l | claude-haiku-5-5 | 2 | 660 | 4 | 37,754 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh g | claude-haiku-5-5 | 2 | 594 | 4 | 37,754 | 6 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 516 | 4 | 37,754 | 5 |
| capture:provenance | claude-sonnet-5-5 | 2 | 352 | 4 | 33,122 | 6 |


wall: 218s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 11,411 | 107,831 | 62 | 00:42:09 | 00:43:11 |
| review | 3 | 21,279 | 1,447,398 | 143 | 00:42:09 | 00:44:32 |
| judge | 3 | 15,705 | 528,549 | 44 | 00:42:09 | 00:42:53 |
| machine | 16 | 18,146 | 690,496 | 96 | 00:42:09 | 00:43:45 |
| triage | 1 | 1,804 | 37,293 | 17 | 00:44:32 | 00:44:49 |
| capture | 1 | 352 | 33,122 | 6 | 00:44:49 | 00:44:55 |
| synthesize | 1 | 8,467 | 51,369 | 51 | 00:44:55 | 00:45:47 |

- **claude-sonnet-5-5**: 7 agent · 21 calls · out 37,739 · in 42 · cache_read 758,164 · cache_create 484,848
- **claude-opus-5-5**: 3 agent · 28 calls · out 21,279 · in 56 · cache_read 1,447,398 · cache_create 201,773
- **claude-haiku-5-5**: 16 agent · 34 calls · out 18,146 · in 68 · cache_read 690,496 · cache_create 604,297

### S4 round 2 — wf_861e73f7-8ff (25 agent, 75,085 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 15 | 9,084 | 30 | 930,519 | 120 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,164 | 4 | 47,647 | 40 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 6,145 | 22 | 390,993 | 1108 |
| review:measurement | claude-opus-5-5 | 7 | 5,950 | 14 | 330,108 | 74 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,529 | 18 | 308,350 | 986 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 5 | 5,369 | 10 | 222,463 | 42 |
| review:bugs | claude-opus-5-5 | 7 | 5,273 | 14 | 315,977 | 110 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 4 | 4,641 | 8 | 170,049 | 35 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,095 | 16 | 265,358 | 863 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 4 | 3,841 | 8 | 130,020 | 31 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,209 | 6 | 82,078 | 28 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 4 | 3,053 | 8 | 125,972 | 209 |
| triage | claude-sonnet-5-5 | 2 | 2,050 | 4 | 36,932 | 15 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,727 | 4 | 37,586 | 15 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,203 | 4 | 37,586 | 96 |
| machine:bash _acceptance/release-3-1-1/chay.sh d | claude-haiku-5-5 | 2 | 1,000 | 4 | 37,602 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 888 | 4 | 34,261 | 183 |
| machine:bash _acceptance/release-3-1-1/chay.sh g | claude-haiku-5-5 | 2 | 769 | 4 | 37,602 | 6 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 754 | 4 | 37,595 | 253 |
| machine:bash _acceptance/release-3-1-1/chay.sh l | claude-haiku-5-5 | 2 | 734 | 4 | 37,602 | 7 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 660 | 4 | 37,602 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh v | claude-haiku-5-5 | 2 | 536 | 4 | 37,601 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh c | claude-haiku-5-5 | 2 | 530 | 4 | 37,601 | 5 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 526 | 4 | 37,642 | 124 |
| capture:provenance | claude-sonnet-5-5 | 2 | 355 | 4 | 32,970 | 7 |


wall: 3936s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 20,307 | 1,576,604 | 120 | 00:52:04 | 00:54:03 |
| machine | 16 | 31,358 | 1,583,031 | 3873 | 00:52:04 | 01:56:37 |
| judge | 3 | 13,851 | 522,532 | 44 | 00:52:04 | 00:52:48 |
| triage | 1 | 2,050 | 36,932 | 15 | 01:56:37 | 01:56:52 |
| capture | 1 | 355 | 32,970 | 7 | 01:56:52 | 01:56:59 |
| synthesize | 1 | 7,164 | 47,647 | 40 | 01:56:59 | 01:57:40 |

- **claude-opus-5-5**: 3 agent · 29 calls · out 20,307 · in 58 · cache_read 1,576,604 · cache_create 207,887
- **claude-sonnet-5-5**: 6 agent · 19 calls · out 23,420 · in 38 · cache_read 640,081 · cache_create 408,995
- **claude-haiku-5-5**: 16 agent · 57 calls · out 31,358 · in 114 · cache_read 1,583,031 · cache_create 735,739

### S4 round 3 — wf_9ccec1b3-f44 (25 agent, 78,769 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 18 | 14,289 | 36 | 1,267,455 | 205 |
| synthesize:report | claude-sonnet-5-5 | 2 | 7,718 | 4 | 48,125 | 43 |
| review:conventions | claude-opus-5-5 | 11 | 7,603 | 22 | 648,695 | 106 |
| review:measurement | claude-opus-5-5 | 7 | 5,745 | 14 | 319,185 | 75 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 11 | 5,034 | 22 | 426,211 | 966 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 4 | 5,022 | 8 | 176,751 | 39 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 5 | 4,862 | 10 | 235,588 | 37 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 3 | 4,808 | 6 | 87,016 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 4,277 | 12 | 169,434 | 829 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 2,909 | 16 | 260,610 | 996 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 2,603 | 6 | 82,373 | 26 |
| triage | claude-sonnet-5-5 | 2 | 2,179 | 4 | 37,340 | 18 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,126 | 6 | 82,599 | 102 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,621 | 4 | 37,729 | 14 |
| machine:bash _acceptance/release-3-1-1/chay.sh v | claude-haiku-5-5 | 2 | 1,134 | 4 | 37,744 | 9 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,025 | 4 | 37,729 | 95 |
| machine:bash _acceptance/release-3-1-1/chay.sh d | claude-haiku-5-5 | 2 | 952 | 4 | 37,745 | 8 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 811 | 4 | 37,738 | 238 |
| machine:bash _acceptance/release-3-1-1/chay.sh l | claude-haiku-5-5 | 2 | 683 | 4 | 37,745 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 651 | 4 | 34,404 | 254 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 640 | 4 | 37,785 | 111 |
| machine:bash _acceptance/release-3-1-1/chay.sh g | claude-haiku-5-5 | 2 | 590 | 4 | 37,745 | 6 |
| machine:bash _acceptance/release-3-1-1/chay.sh c | claude-haiku-5-5 | 2 | 540 | 4 | 37,744 | 6 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 516 | 4 | 37,745 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 431 | 4 | 33,113 | 8 |


wall: 3706s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| machine | 16 | 26,112 | 1,433,080 | 3637 | 02:03:01 | 03:03:39 |
| review | 3 | 27,637 | 2,235,335 | 207 | 02:03:01 | 02:06:28 |
| judge | 3 | 14,692 | 499,355 | 41 | 02:03:01 | 02:03:42 |
| triage | 1 | 2,179 | 37,340 | 18 | 03:03:39 | 03:03:56 |
| capture | 1 | 431 | 33,113 | 8 | 03:03:56 | 03:04:04 |
| synthesize | 1 | 7,718 | 48,125 | 43 | 03:04:04 | 03:04:48 |

- **claude-opus-5-5**: 3 agent · 36 calls · out 27,637 · in 72 · cache_read 2,235,335 · cache_create 231,417
- **claude-sonnet-5-5**: 6 agent · 18 calls · out 25,020 · in 36 · cache_read 617,933 · cache_create 429,415
- **claude-haiku-5-5**: 16 agent · 53 calls · out 26,112 · in 106 · cache_read 1,433,080 · cache_create 739,209

### S4 round 4 — wf_c68c4550-af7 (26 agent, 102,510 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 15 | 14,984 | 30 | 956,463 | 230 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 11,377 | 6 | 45,588 | 542 |
| review:measurement | claude-opus-5-5 | 8 | 11,217 | 16 | 402,990 | 127 |
| synthesize:report | claude-sonnet-5-5 | 2 | 11,120 | 4 | 54,127 | 63 |
| review:conventions | claude-opus-5-5 | 9 | 8,645 | 18 | 434,624 | 102 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 5,587 | 18 | 298,790 | 1059 |
| judge:E8:domain-correctness | claude-sonnet-5-5 | 7 | 5,236 | 14 | 436,456 | 45 |
| triage | claude-sonnet-5-5 | 2 | 4,476 | 4 | 40,411 | 34 |
| judge:E8:spec-alignment | claude-sonnet-5-5 | 4 | 4,347 | 8 | 181,295 | 36 |
| judge:E8:operational-feasibility | claude-sonnet-5-5 | 3 | 4,326 | 6 | 87,838 | 33 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 5 | 3,784 | 10 | 126,524 | 827 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 3 | 3,588 | 6 | 82,049 | 28 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,139 | 12 | 169,243 | 866 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 3 | 2,068 | 6 | 82,168 | 104 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,563 | 4 | 37,553 | 13 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 974 | 4 | 37,553 | 94 |
| machine:bash _acceptance/release-3-1-1/chay.sh v | claude-haiku-5-5 | 2 | 903 | 4 | 37,575 | 10 |
| machine:bash _acceptance/release-3-1-1/chay.sh c | claude-haiku-5-5 | 2 | 862 | 4 | 37,575 | 9 |
| machine:bash _acceptance/release-3-1-1/chay.sh g | claude-haiku-5-5 | 2 | 800 | 4 | 37,576 | 9 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 795 | 4 | 37,562 | 263 |
| machine:bash _acceptance/release-3-1-1/chay.sh d | claude-haiku-5-5 | 2 | 718 | 4 | 37,576 | 9 |
| machine:bash _acceptance/release-3-1-1/chay.sh l | claude-haiku-5-5 | 2 | 708 | 4 | 37,576 | 10 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 658 | 4 | 34,228 | 182 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 648 | 4 | 37,569 | 6 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 551 | 4 | 37,609 | 110 |
| capture:provenance | claude-sonnet-5-5 | 2 | 436 | 4 | 32,937 | 8 |


wall: 3660s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 34,846 | 1,794,077 | 232 | 05:34:56 | 05:38:49 |
| baseline | 1 | 11,377 | 45,588 | 542 | 05:34:56 | 05:43:58 |
| machine | 16 | 26,346 | 1,168,726 | 3554 | 05:34:56 | 06:34:10 |
| judge | 3 | 13,909 | 705,589 | 45 | 05:34:56 | 05:35:42 |
| triage | 1 | 4,476 | 40,411 | 34 | 06:34:10 | 06:34:45 |
| capture | 1 | 436 | 32,937 | 8 | 06:34:45 | 06:34:53 |
| synthesize | 1 | 11,120 | 54,127 | 63 | 06:34:53 | 06:35:56 |

- **claude-opus-5-5**: 3 agent · 32 calls · out 34,846 · in 64 · cache_read 1,794,077 · cache_create 226,069
- **claude-sonnet-5-5**: 7 agent · 23 calls · out 41,318 · in 46 · cache_read 878,652 · cache_create 561,035
- **claude-haiku-5-5**: 16 agent · 48 calls · out 26,346 · in 96 · cache_read 1,168,726 · cache_create 722,718

