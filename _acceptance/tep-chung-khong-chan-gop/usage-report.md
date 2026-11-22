### S4 round 1 — wf_a2830921-79f (32 agent, 110,836 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:bugs | claude-opus-5-5 | 20 | 20,263 | 40 | 1,642,260 | 252 |
| review:conventions | claude-opus-5-5 | 28 | 19,435 | 56 | 2,534,354 | 368 |
| review:measurement | claude-opus-5-5 | 15 | 16,241 | 30 | 1,176,468 | 200 |
| synthesize:report | claude-sonnet-5-5 | 2 | 12,016 | 4 | 58,492 | 69 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 9,046 | 6 | 102,227 | 48 |
| triage | claude-sonnet-5-5 | 2 | 5,342 | 4 | 41,236 | 36 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,946 | 14 | 222,502 | 1072 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 6 | 2,644 | 12 | 176,484 | 821 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 2,386 | 14 | 220,268 | 976 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 1,815 | 4 | 37,551 | 15 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 1,276 | 4 | 37,576 | 79 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 1,058 | 4 | 3,381 | 318 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,018 | 4 | 37,551 | 95 |
| refute:tcg-mutants.test.mjs | claude-sonnet-5-5 | 2 | 995 | 4 | 33,133 | 10 |
| refute:tcg-mutants.test.mjs | claude-sonnet-5-5 | 2 | 907 | 4 | 36,390 | 8 |
| refute:product-map.mjs | claude-sonnet-5-5 | 3 | 893 | 6 | 80,681 | 12 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 840 | 4 | 37,607 | 172 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 804 | 4 | 37,576 | 8 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 746 | 4 | 37,576 | 12 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 742 | 4 | 37,576 | 8 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 740 | 4 | 37,576 | 8 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 739 | 4 | 37,576 | 11 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 691 | 4 | 37,576 | 7 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 682 | 4 | 37,576 | 7 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 645 | 4 | 37,577 | 5 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 633 | 4 | 37,567 | 6 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 618 | 4 | 37,576 | 11 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 614 | 4 | 37,576 | 8 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 593 | 4 | 37,607 | 101 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 561 | 4 | 37,576 | 7 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 534 | 4 | 37,607 | 125 |
| capture:provenance | claude-sonnet-5-5 | 2 | 373 | 4 | 32,945 | 5 |


wall: 3831s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| baseline | 1 | 9,046 | 102,227 | 48 | 23:23:55 | 23:24:43 |
| machine | 22 | 25,325 | 1,299,038 | 3708 | 23:23:55 | 00:25:43 |
| review | 3 | 55,939 | 5,353,082 | 368 | 23:24:03 | 23:30:11 |
| triage | 1 | 5,342 | 41,236 | 36 | 00:25:43 | 00:26:19 |
| refute | 3 | 2,795 | 150,204 | 12 | 00:26:19 | 00:26:32 |
| capture | 1 | 373 | 32,945 | 5 | 00:26:32 | 00:26:37 |
| synthesize | 1 | 12,016 | 58,492 | 69 | 00:26:37 | 00:27:46 |

- **claude-opus-5-5**: 3 agent · 63 calls · out 55,939 · in 126 · cache_read 5,353,082 · cache_create 362,627
- **claude-sonnet-5-5**: 7 agent · 16 calls · out 29,572 · in 32 · cache_read 385,104 · cache_create 363,604
- **claude-haiku-5-5**: 22 agent · 58 calls · out 25,325 · in 116 · cache_read 1,299,038 · cache_create 1,007,519

### S4 round 2 — wf_6dd7eb80-e07 (27 agent, 70,313 out-tok)

| label | model | calls | out | in | cache_read | s |
|---|---|--:|--:|--:|--:|--:|
| review:conventions | claude-opus-5-5 | 10 | 8,752 | 20 | 549,761 | 105 |
| review:measurement | claude-opus-5-5 | 9 | 8,700 | 18 | 510,342 | 107 |
| synthesize:report | claude-sonnet-5-5 | 4 | 8,262 | 8 | 195,768 | 52 |
| baseline:diffBase | claude-sonnet-5-5 | 3 | 7,886 | 6 | 99,617 | 43 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 9 | 6,361 | 18 | 319,492 | 1048 |
| review:bugs | claude-opus-5-5 | 6 | 5,820 | 12 | 269,661 | 135 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 7 | 4,406 | 14 | 226,929 | 875 |
| machine:bash tests/scripts/run-tests.sh --manh m | claude-haiku-5-5 | 8 | 4,136 | 16 | 269,129 | 1021 |
| triage | claude-sonnet-5-5 | 2 | 2,230 | 4 | 37,916 | 18 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 1,275 | 4 | 37,918 | 69 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 1,064 | 4 | 37,949 | 187 |
| machine:bash tests/workflows/run-tests.sh | claude-haiku-5-5 | 2 | 1,033 | 4 | 37,893 | 99 |
| machine:bash tests/hooks/run-tests.sh | claude-haiku-5-5 | 2 | 956 | 4 | 37,893 | 12 |
| machine:bash tests/scripts/run-tests.sh --manh b | claude-haiku-5-5 | 2 | 825 | 4 | 34,521 | 271 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 803 | 4 | 37,918 | 12 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 783 | 4 | 37,918 | 9 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 775 | 4 | 37,918 | 8 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 748 | 4 | 37,918 | 7 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 689 | 4 | 37,918 | 11 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 687 | 4 | 37,918 | 11 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 644 | 4 | 37,949 | 135 |
| machine:bash -c 'set -o pipefail; bash tests/plu | claude-haiku-5-5 | 2 | 642 | 4 | 37,949 | 113 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 632 | 4 | 37,918 | 8 |
| machine:bash _acceptance/tep-chung-khong-chan-go | claude-haiku-5-5 | 2 | 629 | 4 | 37,918 | 8 |
| machine:node tests/scripts/kiem-ban-cai.ca.mjs - | claude-haiku-5-5 | 2 | 607 | 4 | 37,919 | 5 |
| machine:node plugins/acceptance-gate/scripts/pro | claude-haiku-5-5 | 2 | 595 | 4 | 37,909 | 6 |
| capture:provenance | claude-sonnet-5-5 | 2 | 373 | 4 | 33,287 | 5 |


wall: 3847s

| vai tro | agents | out | cache_read | wall s | bat dau | ket thuc |
|---|--:|--:|--:|--:|---|---|
| review | 3 | 23,272 | 1,329,764 | 144 | 00:43:08 | 00:45:32 |
| baseline | 1 | 7,886 | 99,617 | 43 | 00:43:08 | 00:43:51 |
| machine | 20 | 28,290 | 1,456,794 | 3772 | 00:43:08 | 01:46:00 |
| triage | 1 | 2,230 | 37,916 | 18 | 01:46:00 | 01:46:18 |
| capture | 1 | 373 | 33,287 | 5 | 01:46:18 | 01:46:23 |
| synthesize | 1 | 8,262 | 195,768 | 52 | 01:46:23 | 01:47:15 |

- **claude-opus-5-5**: 3 agent · 25 calls · out 23,272 · in 50 · cache_read 1,329,764 · cache_create 223,961
- **claude-sonnet-5-5**: 4 agent · 11 calls · out 18,751 · in 22 · cache_read 366,588 · cache_create 225,047
- **claude-haiku-5-5**: 20 agent · 58 calls · out 28,290 · in 116 · cache_read 1,456,794 · cache_create 915,368

