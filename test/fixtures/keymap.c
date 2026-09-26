#include QMK_KEYBOARD_H
enum custom_keycodes {
    IME_SPC = QK_KB_0,
    IME_ENT,
};
static uint16_t ent_timer;
static bool spc_pressed = false;
bool process_record_user(uint16_t keycode, keyrecord_t *record) {
    switch (keycode) {
        case IME_SPC:
            if (record->event.pressed) {
                spc_pressed = true;
            } else {
                if (spc_pressed) {
                    tap_code(KC_SPC);
                } else {
                    tap_code(KC_LANG1);
                }
            }
            return false;
        case IME_ENT:
            if (record->event.pressed) {
                ent_timer = timer_read();
            } else {
                if (timer_elapsed(ent_timer) < TAPPING_TERM) {
                    tap_code(KC_ENT);
                } else {
                    tap_code(KC_LANG2);
                }
            }
            return false;
    }
    return true;
}
