#include <stdio.h>

int main() {
    int i;
    // Logical error: semicolon after the loop condition
    for(i = 0; i < 5; i++); 
    {
        printf("This will print only once.\n");
    }
    return 0;
}